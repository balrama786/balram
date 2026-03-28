import { Faq, GetFaqsParams, GetFaqsResponse } from '@/src/types/store';
import { baseApi } from './baseApi';

export const faqApi = baseApi.enhanceEndpoints({ addTagTypes: ["Faq"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllFaqs: builder.query<GetFaqsResponse, GetFaqsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        
        return `/faq?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data.faqs
          ? [
              ...result.data.faqs.map(({ _id }) => ({ type: 'Faq' as const, id: _id })),
              { type: 'Faq', id: 'LIST' },
            ]
          : [{ type: 'Faq', id: 'LIST' }],
    }),

    getFaqById: builder.query<{ success: boolean; data: Faq }, string>({
      query: (id) => `/faq/${id}`,
      providesTags: (result, error, id) => [{ type: 'Faq', id }],
    }),
    
    createFaq: builder.mutation<Faq, Omit<Faq, '_id' | 'created_at' | 'updated_at'>>({
      query: (body) => ({
        url: '/faq',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Faq', id: 'LIST' }],
    }),
    
    updateFaq: builder.mutation<Faq, { id: string; data: Partial<Faq> }>({
      query: ({ id, data }) => ({
        url: `/faq/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Faq', id }],
    }),
    
    updateFaqStatus: builder.mutation<Faq, { id: string; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/faq/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Faq', id }],
    }),
    
    deleteFaq: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: '/faq',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Faq', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllFaqsQuery,
  useGetFaqByIdQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useUpdateFaqStatusMutation,
  useDeleteFaqMutation,
} = faqApi;
