import { Testimonial, GetTestimonialsParams, GetTestimonialsResponse } from '@/src/types/store';
import { baseApi } from './baseApi';

export const testimonialApi = baseApi.enhanceEndpoints({ addTagTypes: ["Testimonial"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllTestimonials: builder.query<GetTestimonialsResponse, GetTestimonialsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.rating) queryParams.append('rating', params.rating);
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        
        return `/testimonial?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data.testimonials
          ? [
              ...result.data.testimonials.map(({ _id }) => ({ type: 'Testimonial' as const, id: _id })),
              { type: 'Testimonial', id: 'LIST' },
            ]
          : [{ type: 'Testimonial', id: 'LIST' }],
    }),

    getTestimonialById: builder.query<{ success: boolean; data: Testimonial }, string>({
      query: (id) => `/testimonial/${id}`,
      providesTags: (result, error, id) => [{ type: 'Testimonial', id }],
    }),
    
    createTestimonial: builder.mutation<Testimonial, FormData>({
      query: (formData) => ({
        url: '/testimonial',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Testimonial', id: 'LIST' }],
    }),
    
    updateTestimonial: builder.mutation<Testimonial, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/testimonial/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Testimonial', id },
        { type: 'Testimonial', id: 'LIST' }
      ],
    }),
    
    deleteTestimonial: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: '/testimonial',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Testimonial', id: 'LIST' }],
    }),

    updateTestimonialStatus: builder.mutation<Testimonial, { id: string; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/testimonial/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Testimonial', id },
        { type: 'Testimonial', id: 'LIST' }
      ],
    }),
  }),
});

export const {
  useGetAllTestimonialsQuery,
  useGetTestimonialByIdQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useUpdateTestimonialStatusMutation,
} = testimonialApi;
