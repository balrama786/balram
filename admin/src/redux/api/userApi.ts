import { baseApi } from "./baseApi";
import {
  User,
  GetUsersParams,
  GetUsersResponse,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/src/types/store";

export const userApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["User"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllUsers: builder.query<GetUsersResponse, GetUsersParams>({
        query: (params) => {
          const q = new URLSearchParams();
          if (params.page) q.append("page", String(params.page));
          if (params.limit) q.append("limit", String(params.limit));
          if (params.search) q.append("search", params.search);
          if (params.sort_by) q.append("sort_by", params.sort_by);
          if (params.sort_order) q.append("sort_order", params.sort_order);
          if (params.role && params.role !== "all") q.append("role", params.role);
          if (params.status !== undefined) q.append("status", String(params.status));
          return `/manage_user?${q.toString()}`;
        },
        providesTags: (result) =>
          result?.data?.users
            ? [
                ...result.data.users.map(({ _id }) => ({ type: "User" as const, id: _id })),
                { type: "User", id: "LIST" },
              ]
            : [{ type: "User", id: "LIST" }],
      }),

      getUserById: builder.query<{ success: boolean; data: User }, string>({
        query: (id) => `/manage_user/${id}`,
        providesTags: (_, __, id) => [{ type: "User", id }],
      }),

      createUser: builder.mutation<{ success: boolean; data: User }, CreateUserPayload>({
        query: (body) => ({
          url: "/manage_user",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "User", id: "LIST" }],
      }),

      updateUser: builder.mutation<{ success: boolean; data: User }, { id: string; data: UpdateUserPayload }>({
        query: ({ id, data }) => ({
          url: `/manage_user/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (_, __, { id }) => [{ type: "User", id }, { type: "User", id: "LIST" }],
      }),

      deleteUsers: builder.mutation<{ success: boolean }, { ids: string[] }>({
        query: (body) => ({
          url: "/manage_user",
          method: "DELETE",
          body,
        }),
        invalidatesTags: [{ type: "User", id: "LIST" }],
      }),
    }),
  });

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUsersMutation,
} = userApi;
