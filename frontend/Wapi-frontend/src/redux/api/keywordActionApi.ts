import { baseApi } from "./baseApi";
import { KeywordActionsResponse, KeywordActionResponse, KeywordActionCreatePayload, KeywordActionUpdatePayload, BulkDeleteKeywordActionsResponse } from "@/src/types/keyword-action";

export const keywordActionApi = baseApi.enhanceEndpoints({ addTagTypes: ["KeywordAction"] }).injectEndpoints({
  endpoints: (builder) => ({
    getKeywordActions: builder.query<KeywordActionsResponse, { waba_id: string; page?: number; limit?: number; search?: string }>({
      query: (params) => {
        const qs = new URLSearchParams();
        qs.set("waba_id", params.waba_id);
        if (params.page) qs.set("page", String(params.page));
        if (params.limit) qs.set("limit", String(params.limit));
        if (params.search) qs.set("search", params.search);
        return `/message-bots?${qs.toString()}`;
      },
      providesTags: ["KeywordAction"],
    }),

    getKeywordActionById: builder.query<KeywordActionResponse, string>({
      query: (id) => `/message-bots/${id}`,
      providesTags: (result, error, id) => [{ type: "KeywordAction", id }],
    }),

    createKeywordAction: builder.mutation<KeywordActionResponse, KeywordActionCreatePayload>({
      query: (body) => ({
        url: "/message-bots",
        method: "POST",
        body,
      }),
      invalidatesTags: ["KeywordAction"],
    }),

    updateKeywordAction: builder.mutation<KeywordActionResponse, { id: string; data: KeywordActionUpdatePayload }>({
      query: ({ id, data }) => ({
        url: `/message-bots/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["KeywordAction", { type: "KeywordAction", id }],
    }),

    deleteKeywordAction: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/message-bots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["KeywordAction"],
    }),

    bulkDeleteKeywordActions: builder.mutation<BulkDeleteKeywordActionsResponse, string[]>({
      query: (ids) => ({
        url: "/message-bots/bulk-delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["KeywordAction"],
    }),
  }),
});

export const { useGetKeywordActionsQuery, useGetKeywordActionByIdQuery, useCreateKeywordActionMutation, useUpdateKeywordActionMutation, useDeleteKeywordActionMutation, useBulkDeleteKeywordActionsMutation } = keywordActionApi;
