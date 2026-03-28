/* eslint-disable @typescript-eslint/no-explicit-any */
import { AIModel, GetAIModelsParams, GetAIModelsResponse, GetAIModelByIdResponse, CreateAIModelRequest, UpdateAIModelRequest } from "@/src/types/store";
import { baseApi } from "./baseApi";

export const aiModelApi = baseApi.enhanceEndpoints({ addTagTypes: ["AIModel"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllModels: builder.query<GetAIModelsResponse, GetAIModelsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.provider) queryParams.append("provider", params.provider);
        if (params.capability) queryParams.append("capability", params.capability);
        if (params.search) queryParams.append("search", params.search);
        if (params.sort_by) queryParams.append("sort_by", params.sort_by);
        if (params.sort_order) queryParams.append("sort_order", params.sort_order);

        return `/models?${queryParams.toString()}`;
      },
      providesTags: (result) => (result?.data.models ? [...result.data.models.map(({ name }) => ({ type: "AIModel" as const, id: name })), { type: "AIModel", id: "LIST" }] : [{ type: "AIModel", id: "LIST" }]),
    }),

    getModelById: builder.query<GetAIModelByIdResponse, string>({
      query: (id) => `/models/${id}`,
      providesTags: (result, error, id) => [{ type: "AIModel", id }],
    }),

    createModel: builder.mutation<{ success: boolean; data: AIModel }, CreateAIModelRequest>({
      query: (body) => ({
        url: "/models",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AIModel", id: "LIST" }],
    }),

    updateModel: builder.mutation<{ success: boolean; data: AIModel }, { id: string; data: UpdateAIModelRequest }>({
      query: ({ id, data }) => ({
        url: `/models/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AIModel", id: id },
        { type: "AIModel", id: "LIST" },
      ],
    }),

    bulkDeleteModels: builder.mutation<{ success: boolean; message: string }, string[]>({
      query: (ids) => ({
        url: "/models/delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: "AIModel", id: "LIST" }],
    }),

    testModel: builder.mutation<{ success: boolean; data?: any; message?: string }, any>({
      query: (body) => ({
        url: "/models/test",
        method: "POST",
        body,
      }),
    }),

    toggleModelStatus: builder.mutation<{ success: boolean; data: any }, { id: string; status: "active" | "inactive" }>({
      query: ({ id, status }) => ({
        url: `/models/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AIModel", id: id },
        { type: "AIModel", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetAllModelsQuery, useGetModelByIdQuery, useCreateModelMutation, useUpdateModelMutation, useBulkDeleteModelsMutation, useTestModelMutation, useToggleModelStatusMutation } = aiModelApi;
