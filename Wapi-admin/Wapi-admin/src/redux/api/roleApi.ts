import { CreateRoleRequest, GetPermissionsResponse, GetRoleByIdResponse, GetRolesParams, GetRolesResponse, Role, UpdateRoleRequest } from "@/src/types/store";
import { baseApi } from "./baseApi";

export const roleApi = baseApi.enhanceEndpoints({ addTagTypes: ["Role", "Permission"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query<GetRolesResponse, GetRolesParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.status) queryParams.append("status", params.status);
        if (params.sort_by) queryParams.append("sort_by", params.sort_by);
        if (params.sort_order) queryParams.append("sort_order", params.sort_order);
        return `/roles?${queryParams.toString()}`;
      },
      providesTags: (result) => (result?.data?.roles ? [...result.data.roles.map(({ _id }) => ({ type: "Role" as const, id: _id })), { type: "Role", id: "LIST" }] : [{ type: "Role", id: "LIST" }]),
    }),

    getRoleById: builder.query<GetRoleByIdResponse, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (result, error, id) => [{ type: "Role", id }],
    }),

    getAllPermissions: builder.query<GetPermissionsResponse, void>({
      query: () => "/roles/permissions",
      providesTags: [{ type: "Permission", id: "LIST" }],
    }),

    createRole: builder.mutation<{ success: boolean; message: string; data: Role }, CreateRoleRequest>({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    updateRole: builder.mutation<{ success: boolean; message: string; data: Role }, { id: string; data: UpdateRoleRequest }>({
      query: ({ id, data }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),

    deleteRoles: builder.mutation<{ success: boolean; message: string }, string[]>({
      query: (ids) => ({
        url: "/roles",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    toggleRoleStatus: builder.mutation<{ success: boolean; message: string; data: Role }, string>({
      query: (id) => ({
        url: `/roles/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetAllRolesQuery, useGetRoleByIdQuery, useGetAllPermissionsQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRolesMutation, useToggleRoleStatusMutation } = roleApi;
