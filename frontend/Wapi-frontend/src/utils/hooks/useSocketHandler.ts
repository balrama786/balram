/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { chatApi, useGetRecentChatsQuery } from "@/src/redux/api/chatApi";
import { socket } from "@/src/services/socket-setup";
import { SOCKET } from "@/src/constants";
import { ChatMessage, DateGroupedMessages, MessageGroup } from "@/src/types/components/chat";
import { useNotifications } from "./useNotifications";
import { selectChat } from "@/src/redux/reducers/messenger/chatSlice";
import { useRouter } from "next/navigation";
import { whatsappApi } from "@/src/redux/api/whatsappApi";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { setWorkspace } from "@/src/redux/reducers/workspaceSlice";

const groupNewMessage = (existingData: DateGroupedMessages[], newMessage: ChatMessage) => {
  let foundExisting = false;

  for (const dateGroup of existingData) {
    for (const group of dateGroup.messageGroups) {
      const idx = group.messages.findIndex((m) => {
        if (m.id === newMessage.id) return true;

        if (m.id.startsWith("temp-") && m.direction === newMessage.direction && m.messageType === newMessage.messageType) {
          const timeDiff = Math.abs(new Date(m.createdAt).getTime() - new Date(newMessage.createdAt).getTime());
          if (m.messageType === "text") {
            return m.content === newMessage.content && timeDiff < 60000;
          }
          return timeDiff < 60000;
        }
        return false;
      });

      if (idx !== -1) {
        if (group.messages[idx].id.startsWith("temp-")) {
          group.messages[idx] = newMessage;
          if (group.senderId === "current-user") {
            group.senderId = newMessage.sender.id;
            group.sender = newMessage.sender;
          }
        }
        foundExisting = true;
        break;
      }
    }
    if (foundExisting) break;
  }

  if (foundExisting) return;

  const msgDate = new Date(newMessage.createdAt);
  const dateKey = format(msgDate, "yyyy-MM-dd");

  let dateGroup = existingData.find((g) => g.dateKey === dateKey);
  if (!dateGroup) {
    dateGroup = {
      dateKey,
      dateLabel: isToday(msgDate) ? "Today" : isYesterday(msgDate) ? "Yesterday" : format(msgDate, "MMMM dd, yyyy"),
      messageGroups: [],
    };
    existingData.push(dateGroup);
  }

  const lastGroup = dateGroup.messageGroups[dateGroup.messageGroups.length - 1];

  const isSameSender = lastGroup && (String(lastGroup.senderId) === String(newMessage.sender.id) || (lastGroup.senderId === "current-user" && newMessage.direction === "outbound"));

  if (isSameSender) {
    if (lastGroup.senderId === "current-user") {
      lastGroup.senderId = newMessage.sender.id;
      lastGroup.sender = newMessage.sender;
    }
    lastGroup.messages.push(newMessage);
    lastGroup.lastMessageTime = newMessage.createdAt;
  } else {
    const newGroup: MessageGroup = {
      senderId: newMessage.sender.id,
      sender: newMessage.sender,
      recipient: newMessage.recipient,
      messages: [newMessage],
      createdAt: newMessage.createdAt,
      lastMessageTime: newMessage.createdAt,
    };
    dateGroup.messageGroups.push(newGroup);
  }
};

export const useSocketHandler = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { selectedChat, selectedPhoneNumberId } = useAppSelector((state) => state.chat);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const { sendNotification, startBlinking } = useNotifications();
  const { refetch: refetchWorkspaces } = useGetWorkspacesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const router = useRouter();
  const unreadCountRef = useRef(0);

  const botFetchTimer1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const botFetchTimer2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recentChatsRef = useRef<any[]>([]);

  const { data: recentChatsData } = useGetRecentChatsQuery(
    {
      whatsapp_phone_number_id: selectedPhoneNumberId || undefined,
    },
    { skip: !selectedPhoneNumberId }
  );

  useEffect(() => {
    if (recentChatsData?.data) {
      recentChatsRef.current = recentChatsData.data;
    }
  }, [recentChatsData]);

  useEffect(() => {
    const handleFocus = () => {
      unreadCountRef.current = 0;
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const updateChatArea = useCallback(
    (newMessage: ChatMessage) => {
      if (!selectedChat || !selectedPhoneNumberId) return;

      const activeContactId = String(selectedChat.contact.id);
      const activeContactNumber = String(selectedChat.contact.number);
      const msgSenderId = String(newMessage.sender.id);
      const msgRecipientId = String(newMessage.recipient.id);

      const isRelevant = msgSenderId === activeContactId || msgRecipientId === activeContactId || msgSenderId === activeContactNumber || msgRecipientId === activeContactNumber;

      if (!isRelevant) return;

      let updated = false;

      const cacheParams = [
        { contact_id: selectedChat.contact.id, whatsapp_phone_number_id: selectedPhoneNumberId, start_date: undefined, end_date: undefined },
        { contact_id: activeContactId, whatsapp_phone_number_id: String(selectedPhoneNumberId), start_date: undefined, end_date: undefined },
      ];

      cacheParams.forEach((params) => {
        if (updated) return;
        dispatch(
          chatApi.util.updateQueryData("getMessages", params as any, (draft) => {
            if (!draft || !draft.messages) return;
            groupNewMessage(draft.messages, newMessage);
            updated = true;
          })
        );
      });
    },
    [dispatch, selectedChat, selectedPhoneNumberId]
  );

  const updateSidebar = useCallback(
    (newMessage: ChatMessage) => {
      if (!selectedPhoneNumberId) return;

      let updated = false;
      const cacheParams = [
        {
          whatsapp_phone_number_id: selectedPhoneNumberId,
          search: undefined,
          start_date: undefined,
          end_date: undefined,
          tags: undefined,
          has_notes: undefined,
        },
        {
          whatsapp_phone_number_id: String(selectedPhoneNumberId),
          search: undefined,
          start_date: undefined,
          end_date: undefined,
          tags: undefined,
          has_notes: undefined,
        },
      ];

      let foundInCache = false;

      cacheParams.forEach((params) => {
        if (updated) return;
        dispatch(
          chatApi.util.updateQueryData("getRecentChats", params as any, (draft) => {
            if (!draft || !draft.data) return;

            const targetIdentifier = newMessage.direction === "inbound" ? String(newMessage.sender.id) : String(newMessage.recipient.id);
            const chatIndex = draft.data.findIndex((c) => String(c.contact.id) === targetIdentifier || String(c.contact.number) === targetIdentifier);

            if (chatIndex !== -1) {
              foundInCache = true;
              const chat = draft.data[chatIndex];
              const isViewing = selectedChat && (String(selectedChat.contact.id) === String(chat.contact.id) || String(selectedChat.contact.number) === String(chat.contact.number));

              if (chat.lastMessage.id === newMessage.id) {
                updated = true;
                return;
              }

              chat.lastMessage = {
                id: newMessage.id,
                content: newMessage.content || (newMessage.messageType === "text" ? "" : `[${newMessage.messageType}]`),
                messageType: newMessage.messageType,
                createdAt: newMessage.createdAt,
                unreadCount: chat.lastMessage.unreadCount,
              };

              if (!isViewing && newMessage.direction === "inbound") {
                const currentCount = parseInt(chat.lastMessage.unreadCount || "0");
                chat.lastMessage.unreadCount = (currentCount + 1).toString();
              }

              if (chatIndex > 0) {
                draft.data.splice(chatIndex, 1);
                draft.data.unshift(chat);
              }
              updated = true;
            }
          })
        );
      });

      if (!foundInCache && newMessage.direction === "inbound") {
        dispatch(chatApi.util.invalidateTags(["Chats"]));
      }
    },
    [dispatch, selectedPhoneNumberId, selectedChat]
  );

  const scheduleBotReplyFetch = useCallback(() => {
    if (botFetchTimer1.current) clearTimeout(botFetchTimer1.current);
    if (botFetchTimer2.current) clearTimeout(botFetchTimer2.current);

    botFetchTimer1.current = setTimeout(() => {
      dispatch(chatApi.util.invalidateTags(["Messages"]));
    }, 1500);
    botFetchTimer2.current = setTimeout(() => {
      dispatch(chatApi.util.invalidateTags(["Messages"]));
    }, 4000);
  }, [dispatch]);

  const handleStatusUpdate = useCallback(
    (updatedMessage: ChatMessage) => {
      if (!selectedChat || !selectedPhoneNumberId) return;

      const activeContactId = String(selectedChat.contact.id);
      const activeContactNumber = String(selectedChat.contact.number);
      const msgSenderId = String(updatedMessage.sender.id);
      const msgRecipientId = String(updatedMessage.recipient.id);

      const isRelevant = msgSenderId === activeContactId || msgRecipientId === activeContactId || msgSenderId === activeContactNumber || msgRecipientId === activeContactNumber;

      if (!isRelevant) return;

      const cacheParams = [
        { contact_id: selectedChat.contact.id, whatsapp_phone_number_id: selectedPhoneNumberId, start_date: undefined, end_date: undefined },
        { contact_id: activeContactId, whatsapp_phone_number_id: String(selectedPhoneNumberId), start_date: undefined, end_date: undefined },
      ];

      cacheParams.forEach((params) => {
        dispatch(
          chatApi.util.updateQueryData("getMessages", params as any, (draft) => {
            if (!draft || !draft.messages) return;

            for (const dateGroup of draft.messages) {
              for (const group of dateGroup.messageGroups) {
                const msg = group.messages.find((m) => m.id === updatedMessage.id);
                if (msg) {
                  msg.is_delivered = updatedMessage.is_delivered;
                  msg.delivered_at = updatedMessage.delivered_at;
                  msg.is_seen = updatedMessage.is_seen;
                  msg.seen_at = updatedMessage.seen_at;
                  msg.wa_status = updatedMessage.wa_status;
                  msg.delivery_status = updatedMessage.delivery_status;
                  return;
                }
              }
            }
          })
        );
      });
    },
    [dispatch, selectedChat, selectedPhoneNumberId]
  );

  const handleMessage = useCallback(
    (newMessage: ChatMessage) => {
      updateSidebar(newMessage);
      updateChatArea(newMessage);

      if (newMessage.direction === "inbound") {
        scheduleBotReplyFetch();

        const isChatPage = pathname === "/chat";
        const isCurrentChat = selectedChat && (String(selectedChat.contact.id) === String(newMessage.sender.id) || String(selectedChat.contact.number) === String(newMessage.sender.id));

        if (!isChatPage || !isCurrentChat) {
          unreadCountRef.current += 1;
          const countStr = unreadCountRef.current > 0 ? `(${unreadCountRef.current}) ` : "";
          const msgPreview = newMessage.content || `[${newMessage.messageType}]`;

          sendNotification(`New message from ${newMessage.sender.name}`, {
            body: msgPreview,
            tag: `chat-${newMessage.sender.id}`,
            renotify: true,
            onClick: () => {
              window.focus();

              // Try to find the actual chat object from the cache to ensure we have the database ID
              const cachedChat = recentChatsRef.current?.find((c: any) => String(c.contact.id) === String(newMessage.sender.id) || String(c.contact.number) === String(newMessage.sender.id));

              router.push("/chat");

              if (cachedChat) {
                dispatch(selectChat(cachedChat));
              } else {
                dispatch(
                  selectChat({
                    contact: {
                      id: newMessage.sender.id,
                      number: newMessage.sender.id,
                      name: newMessage.sender.name,
                      avatar: newMessage.sender.avatar,
                      labels: [],
                    },
                    lastMessage: {
                      id: newMessage.id,
                      content: msgPreview,
                      messageType: newMessage.messageType,
                      createdAt: newMessage.createdAt,
                      unreadCount: "0",
                    },
                  } as any)
                );
              }
            },
          } as any);

          startBlinking([`${countStr} New Message!`, `${newMessage.sender.name}`, msgPreview.length > 20 ? msgPreview.substring(0, 20) + "..." : msgPreview]);

          toast.info(`New message from ${newMessage.sender.name}`, {
            description: newMessage.content || `[${newMessage.messageType}]`,
            duration: 4000,
            position: "top-right",
            style: {
              background: "var(--background)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            },
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateSidebar, updateChatArea, scheduleBotReplyFetch, pathname, selectedChat, sendNotification, startBlinking, dispatch, router, selectedPhoneNumberId]
  );

  const handleConnectionUpdate = useCallback(
    async (data: any) => {
      dispatch(
        whatsappApi.util.updateQueryData("getBaileysQRCode", data.waba_id, (draft) => {
          if (draft) {
            draft.data = {
              qr_code: data.qr_code || draft.data?.qr_code,
              status: data.status,
            };
          }
        })
      );

      if (data.status === "connected") {
        toast.success("WhatsApp connected successfully!");
      } else if (data.status === "qr_timeout" && pathname == "/connect_waba") {
        toast.error("QR Code expired. Please refresh.");
      } else if (data.status === "disconnected") {
        toast.error("Connection failed or logged out.");
      }

      try {
        const { data: updatedWorkspaces } = await refetchWorkspaces();
        if (updatedWorkspaces?.data) {
          const currentWs = updatedWorkspaces.data.find((ws: any) => ws._id === selectedWorkspace?._id);
          if (currentWs) {
            dispatch(setWorkspace(currentWs));
          }
        }
      } catch (error) {
        console.error("Failed to refetch workspaces after connection update:", error);
      }
    },
    [dispatch, pathname, refetchWorkspaces, selectedWorkspace?._id]
  );

  useEffect(() => {
    socket.on(SOCKET.Listeners.Whatsapp_Message, handleMessage);
    socket.on(SOCKET.Listeners.Whatsapp_Status, handleStatusUpdate);
    socket.on(SOCKET.Listeners.Whatsapp_Connection_Update, handleConnectionUpdate);

    return () => {
      socket.off(SOCKET.Listeners.Whatsapp_Message, handleMessage);
      socket.off(SOCKET.Listeners.Whatsapp_Status, handleStatusUpdate);
      socket.off(SOCKET.Listeners.Whatsapp_Connection_Update, handleConnectionUpdate);
    };
  }, [handleMessage, handleStatusUpdate, handleConnectionUpdate]);

  useEffect(() => {
    return () => {
      if (botFetchTimer1.current) clearTimeout(botFetchTimer1.current);
      if (botFetchTimer2.current) clearTimeout(botFetchTimer2.current);
    };
  }, []);
};
