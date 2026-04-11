/* eslint-disable @typescript-eslint/no-explicit-any */
import { Currency, DeleteCurrencyResponse, GetCurrenciesParams, GetCurrenciesResponse, GetCurrencyByIdResponse } from "@/src/types/store";
import { baseApi } from "./baseApi";

export const currencyApi = baseApi.enhanceEndpoints({ addTagTypes: ["Currency"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllCurrencies: builder.query<GetCurrenciesResponse, GetCurrenciesParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.is_active !== undefined) queryParams.append("is_active", params.is_active.toString());
        if (params.sort_by) queryParams.append("sort_by", params.sort_by);
        if (params.sort_order) queryParams.append("sort_order", params.sort_order);

        return `/currencies?${queryParams.toString()}`;
      },
      providesTags: (result) => (result?.data?.currencies ? [...result.data.currencies.map(({ _id }) => ({ type: "Currency" as const, id: _id })), { type: "Currency", id: "LIST" }] : [{ type: "Currency", id: "LIST" }]),
    }),

    getCurrencyById: builder.query<GetCurrencyByIdResponse, string>({
      query: (id) => `/currencies/${id}`,
      providesTags: (result, error, id) => [{ type: "Currency", id }],
    }),

    createCurrency: builder.mutation<{ success: boolean; data: Currency }, any>({
      query: (body) => ({
        url: "/currencies",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Currency", id: "LIST" }],
    }),

    updateCurrency: builder.mutation<{ success: boolean; data: Currency }, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/currencies/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Currency", id },
        { type: "Currency", id: "LIST" },
      ],
    }),

    deleteCurrency: builder.mutation<DeleteCurrencyResponse, string[]>({
      query: (ids) => ({
        url: "/currencies",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: [{ type: "Currency", id: "LIST" }],
    }),

    toggleCurrencyStatus: builder.mutation<{ success: boolean; message: string; data: Currency }, string>({
      query: (id) => ({
        url: `/currencies/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Currency", id },
        { type: "Currency", id: "LIST" },
      ],
    }),

    toggleDefaultCurrency: builder.mutation<{ success: boolean; message: string; data: Currency }, string>({
      query: (id) => ({
        url: `/currencies/${id}/toggle-default`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Currency", id }, { type: "Currency", id: "LIST" }, { type: "Settings" as any }],
    }),
  }),
});

export const { useGetAllCurrenciesQuery, useGetCurrencyByIdQuery, useCreateCurrencyMutation, useUpdateCurrencyMutation, useDeleteCurrencyMutation, useToggleCurrencyStatusMutation, useToggleDefaultCurrencyMutation } = currencyApi;
