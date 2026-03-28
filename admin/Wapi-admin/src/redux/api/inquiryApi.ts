import { CreateInquiryRequest, CreateInquiryResponse, DeleteInquiryResponse, GetInquiriesParams, GetInquiriesResponse, GetInquiryByIdResponse, UpdateInquiryStatusResponse } from '@/src/types/store';
import { baseApi } from './baseApi';

export const inquiryApi = baseApi.enhanceEndpoints({ addTagTypes: ["Inquiry"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllInquiries: builder.query<GetInquiriesResponse, GetInquiriesParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        
        return `/inquiry?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data.inquiries
          ? [
              ...result.data.inquiries.map(({ _id }) => ({ type: 'Inquiry' as const, id: _id })),
              { type: 'Inquiry', id: 'LIST' },
            ]
          : [{ type: 'Inquiry', id: 'LIST' }],
    }),

    getInquiryById: builder.query<GetInquiryByIdResponse, string>({
      query: (id) => `/inquiry/${id}`,
      providesTags: (result, error, id) => [{ type: 'Inquiry', id }],
    }),

    createInquiry: builder.mutation<CreateInquiryResponse, CreateInquiryRequest>({
      query: (data) => ({
        url: '/inquiry',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Inquiry', id: 'LIST' }],
    }),
    
    deleteInquiry: builder.mutation<DeleteInquiryResponse, string[]>({
      query: (ids) => ({
        url: '/inquiry',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Inquiry', id: 'LIST' }],
    }),

    updateInquiryStatus: builder.mutation<UpdateInquiryStatusResponse, { id: string; isRead: boolean }>({
      query: ({ id, isRead }) => ({
        url: `/inquiry/${id}/status`,
        method: 'PATCH',
        body: { isRead },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Inquiry', id },
        { type: 'Inquiry', id: 'LIST' }
      ],
    }),
  }),
});

export const {
  useGetAllInquiriesQuery,
  useGetInquiryByIdQuery,
  useCreateInquiryMutation,
  useDeleteInquiryMutation,
  useUpdateInquiryStatusMutation,
} = inquiryApi;