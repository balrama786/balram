import { 
  Language, 
  GetLanguagesParams, 
  GetLanguagesResponse, 
  GetLanguageByIdResponse,
  CreateLanguageRequest,
  UpdateLanguageRequest,
  DeleteLanguageResponse
} from '@/src/types/store';
import { baseApi } from './baseApi';

export const languageApi = baseApi.enhanceEndpoints({ addTagTypes: ["Language"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllLanguages: builder.query<GetLanguagesResponse, GetLanguagesParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status !== undefined) queryParams.append('status', params.status.toString());
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        
        return `/language?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data?.languages
          ? [
              ...result.data.languages.map(({ _id }) => ({ type: 'Language' as const, id: _id })),
              { type: 'Language', id: 'LIST' },
            ]
          : [{ type: 'Language', id: 'LIST' }],
    }),

    getLanguageById: builder.query<GetLanguageByIdResponse, string>({
      query: (id) => `/language/${id}`,
      providesTags: (result, error, id) => [{ type: 'Language', id }],
    }),
    
    createLanguage: builder.mutation<{ success: boolean; data: Language }, CreateLanguageRequest>({
      query: (body) => ({
        url: '/language',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Language', id: 'LIST' }],
    }),
    
    updateLanguage: builder.mutation<{ success: boolean; data: Language }, { id: string; data: UpdateLanguageRequest }>({
      query: ({ id, data }) => ({
        url: `/language/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Language', id },
        { type: 'Language', id: 'LIST' },
      ],
    }),

    deleteLanguage: builder.mutation<DeleteLanguageResponse, string[]>({
      query: (ids) => ({
        url: '/language',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Language', id: 'LIST' }],
    }),

  }),
});

export const {
  useGetAllLanguagesQuery,
  useGetLanguageByIdQuery,
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,
} = languageApi;
