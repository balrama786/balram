import { 
  Subscription, 
  GetSubscriptionsParams, 
  GetSubscriptionsResponse,
  GetPaymentHistoryParams,
  GetPaymentHistoryResponse
} from '@/src/types/store';
import { baseApi } from './baseApi';

export const subscriptionApi = baseApi.enhanceEndpoints({ addTagTypes: ["Subscription"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriptions: builder.query<GetSubscriptionsResponse, GetSubscriptionsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        
        return `/subscription?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data.subscriptions
          ? [
              ...result.data.subscriptions.map(({ _id }) => ({ type: 'Subscription' as const, id: _id })),
              { type: 'Subscription', id: 'LIST' },
            ]
          : [{ type: 'Subscription', id: 'LIST' }],
    }),

    getSubscriptionById: builder.query<{ success: boolean; data: Subscription }, string>({
      query: (id) => `/subscription/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subscription', id }],
    }),

    approveManualSubscription: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/subscription/${id}/approve-manual`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Subscription', id: 'LIST' }],
    }),

    rejectManualSubscription: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/subscription/${id}/reject-manual`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Subscription', id: 'LIST' }],
    }),
    
    getSubscriptionPayments: builder.query<GetPaymentHistoryResponse, GetPaymentHistoryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.payment_status) queryParams.append('payment_status', params.payment_status);
        if (params.payment_gateway) queryParams.append('payment_gateway', params.payment_gateway);
        if (params.start_date) queryParams.append('start_date', params.start_date);
        if (params.end_date) queryParams.append('end_date', params.end_date);
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        
        return `/subscription/payments?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data.payments
          ? [
              ...result.data.payments.map(({ _id }) => ({ type: 'Subscription' as const, id: _id })),
              { type: 'Subscription', id: 'PAYMENT_LIST' },
            ]
          : [{ type: 'Subscription', id: 'PAYMENT_LIST' }],
    }),
  }),
});

export const {
  useGetAllSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useApproveManualSubscriptionMutation,
  useRejectManualSubscriptionMutation,
  useGetSubscriptionPaymentsQuery,
} = subscriptionApi;
