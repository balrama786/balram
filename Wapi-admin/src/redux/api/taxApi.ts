import { baseApi } from "./baseApi";
import { Tax, GetTaxesParams, GetTaxesResponse } from "@/src/types/store";

export const taxApi = baseApi.enhanceEndpoints({ addTagTypes: ["Tax"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllTaxes: builder.query<GetTaxesResponse, GetTaxesParams>({
      query: (params) => ({
        url: "/taxes",
        method: "GET",
        params,
      }),
      providesTags: (result) => (result ? [...result.data.taxes.map(({ _id }) => ({ type: "Tax" as const, id: _id })), { type: "Tax", id: "LIST" }] : [{ type: "Tax", id: "LIST" }]),
    }),

    getTaxById: builder.query<{ success: boolean; data: Tax }, string>({
      query: (id) => ({
        url: `/taxes/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Tax", id }],
    }),

    createTax: builder.mutation<{ success: boolean; message: string; data: Tax }, Partial<Tax>>({
      query: (body) => ({
        url: "/taxes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tax", id: "LIST" }],
    }),

    updateTax: builder.mutation<{ success: boolean; message: string; data: Tax }, { id: string; body: Partial<Tax> }>({
      query: ({ id, body }) => ({
        url: `/taxes/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tax", id },
        { type: "Tax", id: "LIST" },
      ],
    }),

    deleteTax: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/taxes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Tax", id: "LIST" }],
    }),

    bulkDeleteTaxes: builder.mutation<{ success: boolean; message: string; data: { deletedCount: number; deletedIds: string[] } }, string[]>({
      query: (ids) => ({
        url: "/taxes/bulk-delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: "Tax", id: "LIST" }],
    }),
  }),
});

export const { useGetAllTaxesQuery, useGetTaxByIdQuery, useCreateTaxMutation, useUpdateTaxMutation, useDeleteTaxMutation, useBulkDeleteTaxesMutation } = taxApi;
