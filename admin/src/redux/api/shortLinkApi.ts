import { 
  GetShortLinksParams, 
  GetShortLinksResponse 
} from '@/src/types/store';
import { baseApi } from './baseApi';

export const shortLinkApi = baseApi.enhanceEndpoints({ addTagTypes: ["ShortLink"] }).injectEndpoints({
  endpoints: (builder) => ({
    getShortLinks: builder.query<GetShortLinksResponse, GetShortLinksParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        
        return `/short_link?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data.short_links
          ? [
              ...result.data.short_links.map(({ _id }) => ({ type: 'ShortLink' as const, id: _id })),
              { type: 'ShortLink', id: 'LIST' },
            ]
          : [{ type: 'ShortLink', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetShortLinksQuery,
} = shortLinkApi;
