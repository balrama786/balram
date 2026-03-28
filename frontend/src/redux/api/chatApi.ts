/* eslint-disable @typescript-eslint/no-explicit-any */
import { AiTextTransformRequest, AiTextTransformResponse, ChatMessage, GetMessagesResponse, RecentChatData, SendMessagePayload, SuggestReplyRequest, SuggestReplyResponse } from "@/src/types/components/chat";
import { baseApi } from "./baseApi";
import { createOptimisticMessage, getTodayDateInfo } from "./utils/optimisticMessageUtils";

export const chatApi = baseApi.enhanceEndpoints({ addTagTypes: ["Chats", "Messages"] }).injectEndpoints({
  endpoints: (builder) => ({
    getRecentChats: builder.query<RecentChatData, { search?: string; whatsapp_phone_number_id?: string; start_date?: string; end_date?: string; tags?: string; has_notes?: boolean; last_message_read?: boolean; is_assigned?: boolean; agent_id?: string }>({
      query: (params) => ({
        url: "/whatsapp/chats",
        method: "GET",
        params,
      }),
      providesTags: ["Chats"],
    }),
    getMessages: builder.query<GetMessagesResponse, { contact_id?: string; whatsapp_phone_number_id?: string; page?: number; limit?: number; search?: string; start_date?: string; end_date?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.contact_id) queryParams.append("contact_id", params.contact_id);
        if (params.whatsapp_phone_number_id) queryParams.append("whatsapp_phone_number_id", params.whatsapp_phone_number_id);
        if (params.search) queryParams.append("search", params.search);
        if (params.start_date) queryParams.append("start_date", params.start_date);
        if (params.end_date) queryParams.append("end_date", params.end_date);

        return { url: `/whatsapp/messages?${queryParams.toString()}`, method: "GET" };
      },
      transformResponse: (response: GetMessagesResponse) => {
        if (!response.messages) return response;

        // Create a map for quick access to messages by wa_message_id
        const messageMap: Record<string, ChatMessage> = {};
        const reactions: ChatMessage[] = [];

        response.messages.forEach((dateGroup) => {
          dateGroup.messageGroups.forEach((group) => {
            group.messages.forEach((message) => {
              if (message.wa_message_id) {
                messageMap[message.wa_message_id] = message;
              }
              if (message.messageType === "reaction" && message.reaction_message_id) {
                reactions.push(message);
              }
            });
          });
        });

        // Map reactions to their target messages
        reactions.forEach((reaction) => {
          const targetMessage = messageMap[reaction.reaction_message_id!];
          if (targetMessage) {
            if (!targetMessage.reactions) {
              targetMessage.reactions = [];
            }
            const existingReaction = targetMessage.reactions.find((r) => r.emoji === reaction.content);
            if (existingReaction) {
              if (!existingReaction.users.find((u) => u.id === reaction.sender.id)) {
                existingReaction.users.push(reaction.sender);
              }
            } else {
              targetMessage.reactions.push({
                emoji: reaction.content!,
                users: [reaction.sender],
              });
            }
          }
        });

        // Filter out reaction messages from the UI list
        response.messages.forEach((dateGroup) => {
          dateGroup.messageGroups.forEach((group) => {
            group.messages = group.messages.filter((m) => m.messageType !== "reaction");
          });
          // Remove empty message groups or groups with no messages after filtering
          dateGroup.messageGroups = dateGroup.messageGroups.filter((g) => g.messages.length > 0);
        });

        // Filter out empty date groups
        response.messages = response.messages.filter((dg) => dg.messageGroups.length > 0);

        return response;
      },
      providesTags: ["Messages"],
    }),
    sendMessage: builder.mutation<void, SendMessagePayload | FormData>({
      query: (body) => ({
        url: "/whatsapp/send",
        method: "POST",
        body,
      }),
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        let contact_id: string = "";
        let whatsapp_phone_number_id: string = "";

        if (payload instanceof FormData) {
          contact_id = (payload.get("contact_id") as string) || "";
          whatsapp_phone_number_id = (payload.get("whatsapp_phone_number_id") as string) || "";
        } else {
          contact_id = payload.contact_id;
          whatsapp_phone_number_id = payload.whatsapp_phone_number_id;
        }

        const patchResult = dispatch(
          chatApi.util.updateQueryData(
            "getMessages",
            {
              contact_id,
              whatsapp_phone_number_id,
            },
            (draft) => {
              let replyMessageId: string | undefined;
              if (payload instanceof FormData) {
                replyMessageId = payload.get("replyMessageId") as string;
              } else {
                replyMessageId = payload.replyMessageId;
              }

              let reply_message = null;
              if (replyMessageId) {
                for (const dateGroup of draft.messages) {
                  for (const group of dateGroup.messageGroups) {
                    const found = group.messages.find((m) => m.wa_message_id === replyMessageId);
                    if (found) {
                      reply_message = found;
                      break;
                    }
                  }
                  if (reply_message) break;
                }
              }

              const isReaction = (payload as any).messageType === "reaction";

              if (isReaction && (payload as any).reactionMessageId) {
                // Find and update target message reactions
                for (const dateGroup of draft.messages) {
                  for (const group of dateGroup.messageGroups) {
                    const target = group.messages.find((m) => m.wa_message_id === (payload as any).reactionMessageId);
                    if (target) {
                      if (!target.reactions) target.reactions = [];
                      const emoji = (payload as any).reactionEmoji;

                      // 1. Remove this user from any existing reactions for this message
                      target.reactions.forEach((r) => {
                        r.users = r.users?.filter((u) => u.id !== "current-user") || [];
                      });

                      // 2. Clear out any reactions that now have no users
                      target.reactions = target.reactions.filter((r) => r.users.length > 0);

                      // 3. Find or add the new reaction
                      const existing = target.reactions.find((r) => r.emoji === emoji);
                      if (existing) {
                        existing.users.push({ id: "current-user", name: "You", avatar: null });
                      } else {
                        target.reactions.push({
                          emoji,
                          users: [{ id: "current-user", name: "You", avatar: null }],
                        });
                      }
                      return; // Exit if found and updated
                    }
                  }
                }
                return; // Exit if it's a reaction but target not found (fallback to no optimistic message)
              }

              const tempMessage = createOptimisticMessage(payload, reply_message);
              const { dateLabel, dateKey } = getTodayDateInfo();

              let todayGroup = draft.messages.find((dg) => dg.dateKey === dateKey);

              if (!todayGroup) {
                todayGroup = {
                  dateLabel,
                  dateKey,
                  messageGroups: [],
                };
                draft.messages.push(todayGroup);
              }

              const lastMessageGroup = todayGroup.messageGroups[todayGroup.messageGroups.length - 1];

              const canAppend = lastMessageGroup && lastMessageGroup.senderId === "current-user";

              if (canAppend) {
                lastMessageGroup.messages.push(tempMessage);
                lastMessageGroup.lastMessageTime = tempMessage.createdAt;
              } else {
                const newUserGroup = {
                  senderId: "current-user",
                  sender: tempMessage.sender,
                  recipient: tempMessage.recipient,
                  messages: [tempMessage],
                  createdAt: tempMessage.createdAt,
                  lastMessageTime: tempMessage.createdAt,
                };
                todayGroup.messageGroups.push(newUserGroup);
              }
            }
          )
        );

        try {
          await queryFulfilled;
          dispatch(chatApi.util.invalidateTags(["Chats"]));
        } catch {
          patchResult.undo();
        }
      },
    }),
    getContactProfile: builder.query<any, { contact_id: string; whatsapp_phone_number_id: string }>({
      query: (params) => ({
        url: "/whatsapp/contact-profile",
        method: "GET",
        params,
      }),
      providesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    assignAgent: builder.mutation<void, { contact_id: string; agent_id: string; whatsapp_phone_number_id: string }>({
      query: (body) => ({
        url: "/whatsapp/assign-chat",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    unassignAgent: builder.mutation<void, { contact_id: string; whatsapp_phone_number_id: string }>({
      query: (body) => ({
        url: "/whatsapp/unassign-chat",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    addChatNote: builder.mutation<void, { contact_id: string; whatsapp_phone_number_id: string; note: string }>({
      query: (body) => ({
        url: "/chat/chat-note",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    deleteChatNote: builder.mutation<void, { ids: string[]; contact_id: string }>({
      query: (body) => ({
        url: "/chat/chat-note",
        method: "DELETE",
        body: { ids: body.ids },
      }),
      invalidatesTags: (result, error, { contact_id }) => [{ type: "Chats", id: contact_id }],
    }),
    suggestReply: builder.mutation<SuggestReplyResponse, SuggestReplyRequest>({
      query: (body) => ({
        url: "/chat/suggest-reply",
        method: "POST",
        body,
      }),
    }),
    transformMessage: builder.mutation<AiTextTransformResponse, AiTextTransformRequest>({
      query: (body) => ({
        url: "/chat/transform",
        method: "POST",
        body,
      }),
    }),
    addChatTag: builder.mutation<void, { contact_id: string; tag_id: string; whatsapp_phone_number_id: string }>({
      query: (body) => ({
        url: "/chat/add-tag",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chats"],
    }),
    deleteChatTag: builder.mutation<void, { contactId: string; tagId: string; whatsapp_phone_number_id: string }>({
      query: (body) => ({
        url: "/chat/delete-tag",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Chats"],
    }),
    togglePinChat: builder.mutation<void, { contact_id: string; phone_number: string }>({
      query: (body) => ({
        url: "/whatsapp/pin-chat",
        method: "POST",
        body,
      }),
      async onQueryStarted({ contact_id }, { dispatch, queryFulfilled, getState }) {
        const state: any = getState();
        const selectedPhoneNumberId = state.chat.selectedPhoneNumberId;

        const patchResult = dispatch(
          chatApi.util.updateQueryData(
            "getRecentChats",
            {
              whatsapp_phone_number_id: selectedPhoneNumberId || undefined,
            } as any,
            (draft) => {
              const chat = draft.data.find((c) => c.contact.id === contact_id);
              if (chat) {
                chat.is_pinned = !chat.is_pinned;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateChatStatus: builder.mutation<void, { contact_id: string; status: "open" | "resolved"; whatsapp_phone_number_id: string }>({
      query: (body) => ({
        url: "/chat/status",
        method: "POST",
        body,
      }),
      async onQueryStarted({ contact_id, status }, { dispatch, queryFulfilled, getState }) {
        const state: any = getState();
        const selectedPhoneNumberId = state.chat.selectedPhoneNumberId;

        const patchResult = dispatch(
          chatApi.util.updateQueryData(
            "getRecentChats",
            {
              whatsapp_phone_number_id: selectedPhoneNumberId || undefined,
            } as any,
            (draft) => {
              const chat = draft.data.find((c) => c.contact.id === contact_id);
              if (chat) {
                chat.contact.chat_status = status;
              }
            }
          )
        );

        try {
          await queryFulfilled;
          dispatch(chatApi.util.invalidateTags(["Chats"]));
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetRecentChatsQuery, useGetMessagesQuery, useSendMessageMutation, useGetContactProfileQuery, useAssignAgentMutation, useUnassignAgentMutation, useSuggestReplyMutation, useTransformMessageMutation, useAddChatNoteMutation, useDeleteChatNoteMutation, useAddChatTagMutation, useDeleteChatTagMutation, useTogglePinChatMutation, useUpdateChatStatusMutation } = chatApi;
