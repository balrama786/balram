import { Page, GetPagesParams, GetPagesResponse } from "@/src/types/store";
import { baseApi } from "./baseApi";

export const pageApi = baseApi.enhanceEndpoints({ addTagTypes: ["Page"] }).injectEndpoints({
  endpoints: (builder) => ({
    getPages: builder.query<GetPagesResponse, GetPagesParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.status) queryParams.append("status", params.status);
        if (params.sort_by) queryParams.append("sort_by", params.sort_by);
        if (params.sort_order) queryParams.append("sort_order", params.sort_order);

        return `/pages?${queryParams.toString()}`;
      },
      providesTags: (result) => (result?.data.pages ? [...result.data.pages.map(({ _id }) => ({ type: "Page" as const, id: _id })), { type: "Page", id: "LIST" }] : [{ type: "Page", id: "LIST" }]),
    }),

    getPageById: builder.query<{ success: boolean; data: Page }, string>({
      query: (id) => `/pages/${id}`,
      providesTags: (result, error, id) => [{ type: "Page", id }],
    }),

    createPage: builder.mutation<{ success: boolean; data: Page }, FormData>({
      query: (body) => ({
        url: "/pages",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Page", id: "LIST" }],
    }),

    updatePage: builder.mutation<{ success: boolean; data: Page }, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/pages/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Page", id },
        { type: "Page", id: "LIST" },
      ],
    }),

    togglePageStatus: builder.mutation<{ success: boolean; data: Page }, string>({
      query: (id) => ({
        url: `/pages/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Page", id },
        { type: "Page", id: "LIST" },
      ],
    }),

    deletePages: builder.mutation<{ success: boolean; message: string }, string[]>({
      query: (ids) => ({
        url: "/pages/delete",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: [{ type: "Page", id: "LIST" }],
    }),
  }),
});

export const { useGetPagesQuery, useGetPageByIdQuery, useCreatePageMutation, useUpdatePageMutation, useTogglePageStatusMutation, useDeletePagesMutation } = pageApi;
