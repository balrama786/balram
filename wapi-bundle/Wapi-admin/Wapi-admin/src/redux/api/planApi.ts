import { 
  Plan, 
  GetPlansParams, 
  GetPlansResponse, 
  GetPlanByIdResponse,
  CreatePlanRequest,
  UpdatePlanRequest,
  DeletePlanResponse
} from '@/src/types/store';
import { baseApi } from './baseApi';

export const planApi = baseApi.enhanceEndpoints({ addTagTypes: ["Plan"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllPlans: builder.query<GetPlansResponse, GetPlansParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
        if (params.is_featured !== undefined) queryParams.append('is_featured', params.is_featured.toString());
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        
        return `/plan?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data.plans
          ? [
              ...result.data.plans.map(({ _id }) => ({ type: 'Plan' as const, id: _id })),
              { type: 'Plan', id: 'LIST' },
            ]
          : [{ type: 'Plan', id: 'LIST' }],
    }),

    getPlanById: builder.query<GetPlanByIdResponse, string>({
      query: (id) => `/plan/${id}`,
      providesTags: (result, error, id) => [{ type: 'Plan', id }],
    }),
    
    createPlan: builder.mutation<{ success: boolean; data: Plan }, CreatePlanRequest>({
      query: (body) => ({
        url: '/plan',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Plan', id: 'LIST' }],
    }),
    
    updatePlan: builder.mutation<{ success: boolean; data: Plan }, { id: string; data: UpdatePlanRequest }>({
      query: ({ id, data }) => ({
        url: `/plan/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Plan', id },
        { type: 'Plan', id: 'LIST' },
      ],
    }),

    deletePlan: builder.mutation<DeletePlanResponse, string[]>({
      query: (ids) => ({
        url: '/plan',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Plan', id: 'LIST' }],
    }),

  }),
});

export const {
  useGetAllPlansQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = planApi;
