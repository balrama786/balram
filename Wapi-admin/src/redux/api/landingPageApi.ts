import { baseApi } from "./baseApi";
import { GetLandingPageResponse, UpdateLandingPageResponse, UploadLandingImageResponse, LandingPageData } from "../../types/landingPage";

export const landingPageApi = baseApi.enhanceEndpoints({ addTagTypes: ["LandingPage"] }).injectEndpoints({
  endpoints: (builder) => ({
    getLandingPage: builder.query<GetLandingPageResponse, void>({
      query: () => "/landing_page",
      providesTags: ["LandingPage"],
    }),
    updateLandingPage: builder.mutation<UpdateLandingPageResponse, Partial<LandingPageData>>({
      query: (body) => ({
        url: "/landing_page",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["LandingPage"],
    }),
    uploadLandingImage: builder.mutation<UploadLandingImageResponse, FormData>({
      query: (formData) => ({
        url: "/landing_page/upload_image",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useGetLandingPageQuery, useUpdateLandingPageMutation, useUploadLandingImageMutation } = landingPageApi;
