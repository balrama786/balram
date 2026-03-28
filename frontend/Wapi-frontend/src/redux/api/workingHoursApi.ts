import { baseApi } from "./baseApi";
import { WorkingHoursPayload, WorkingHoursResponse } from "@/src/types/working-hours";

export const workingHoursApi = baseApi.enhanceEndpoints({ addTagTypes: ["WorkingHours"] }).injectEndpoints({
  endpoints: (builder) => ({
    getWorkingHours: builder.query<WorkingHoursResponse, string>({
      query: (wabaId) => `/working-hours/${wabaId}`,
      providesTags: (_, __, wabaId) => [{ type: "WorkingHours", id: wabaId }],
    }),

    upsertWorkingHours: builder.mutation<WorkingHoursResponse, WorkingHoursPayload>({
      query: (body) => ({
        url: "/working-hours",
        method: "POST",
        body,
      }),
      invalidatesTags: (_, __, arg) => [{ type: "WorkingHours", id: arg.waba_id }],
    }),
  }),
});

export const { useGetWorkingHoursQuery, useUpsertWorkingHoursMutation } = workingHoursApi;
