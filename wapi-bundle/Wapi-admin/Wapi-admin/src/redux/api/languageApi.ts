/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeleteLanguageResponse,
  GetLanguageByIdResponse,
  GetLanguagesParams,
  GetLanguagesResponse,
  Language
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
        if (params.status !== undefined) queryParams.append('is_active', params.status.toString());
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        
        return `/languages?${queryParams.toString()}`;
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
      query: (id) => `/languages/${id}`,
      providesTags: (result, error, id) => [{ type: 'Language', id }],
    }),
    
    createLanguage: builder.mutation<{ success: boolean; data: Language }, FormData>({
      query: (body) => ({
        url: '/languages',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Language', id: 'LIST' }],
    }),
    
    updateLanguage: builder.mutation<{ success: boolean; data: Language }, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/languages/${id}`,
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
        url: '/languages',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Language', id: 'LIST' }],
    }),

    toggleLanguageStatus: builder.mutation<{ success: boolean; message: string; data: Language }, string>({
      query: (id) => ({
        url: `/languages/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Language', id },
        { type: 'Language', id: 'LIST' },
      ],
    }),

    getTranslations: builder.query<{ success: boolean; data: any }, string>({
      query: (id) => `/languages/translations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Language', id: `TRANSLATIONS_${id}` }],
    }),

    updateTranslations: builder.mutation<{ success: boolean; message: string; data: any }, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/languages/translations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Language', id: `TRANSLATIONS_${id}` }],
    }),

  }),
});

export const {
  useGetAllLanguagesQuery,
  useGetLanguageByIdQuery,
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,
  useToggleLanguageStatusMutation,
  useGetTranslationsQuery,
  useUpdateTranslationsMutation,
} = languageApi;
