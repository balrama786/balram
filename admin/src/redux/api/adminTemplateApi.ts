import { AdminTemplate, GetAdminTemplatesParams, GetAdminTemplatesResponse } from "@/src/types/store";
import { baseApi } from "./baseApi";

export const adminTemplateApi = baseApi.enhanceEndpoints({ addTagTypes: ["AdminTemplate"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllAdminTemplates: builder.query<GetAdminTemplatesResponse, GetAdminTemplatesParams>({
      query: (params) => {
        const q = new URLSearchParams();
        if (params.page) q.append("page", params.page.toString());
        if (params.limit) q.append("limit", params.limit.toString());
        if (params.search) q.append("search", params.search);
        if (params.sector) q.append("sector", params.sector);
        if (params.category) q.append("category", params.category);
        if (params.template_category) q.append("template_category", params.template_category);
        if (params.status) q.append("status", params.status);
        if (params.sort_by) q.append("sort_by", params.sort_by);
        if (params.sort_order) q.append("sort_order", params.sort_order);
        return `/admin/template?${q.toString()}`;
      },
      providesTags: (result) => (result?.data?.templates ? [...result.data.templates.map(({ _id }) => ({ type: "AdminTemplate" as const, id: _id })), { type: "AdminTemplate" as const, id: "LIST" }] : [{ type: "AdminTemplate" as const, id: "LIST" }]),
    }),

    getAdminTemplateById: builder.query<{ success: boolean; data: AdminTemplate }, string>({
      query: (id) => `/admin/template/${id}`,
      providesTags: (_, __, id) => [{ type: "AdminTemplate" as const, id }],
    }),

    createAdminTemplate: builder.mutation<{ success: boolean; data: AdminTemplate }, FormData | object>({
      query: (body) => ({
        url: "/admin/template",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AdminTemplate" as const, id: "LIST" }],
    }),

    updateAdminTemplate: builder.mutation<{ success: boolean; data: AdminTemplate }, { id: string; data: FormData | object }>({
      query: ({ id, data }) => ({
        url: `/admin/template/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "AdminTemplate" as const, id },
        { type: "AdminTemplate" as const, id: "LIST" },
      ],
    }),

    deleteAdminTemplate: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/template/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AdminTemplate" as const, id: "LIST" }],
    }),

    bulkDeleteAdminTemplates: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: "/admin/template",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: [{ type: "AdminTemplate" as const, id: "LIST" }],
    }),
  }),
});

export const { useGetAllAdminTemplatesQuery, useGetAdminTemplateByIdQuery, useCreateAdminTemplateMutation, useUpdateAdminTemplateMutation, useDeleteAdminTemplateMutation, useBulkDeleteAdminTemplatesMutation } = adminTemplateApi;
