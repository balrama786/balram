import { authUtils } from "@/src/utils/auth";
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logout } from "../reducers/authSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

const EXPIRATION_MESSAGES = [
  "Session expired or logged out",
  "Token is invalid or expired",
  "Session expired",
  "Token expired",
  "Please log in again",
];

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = authUtils.getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const isSessionExpired = (message: string): boolean => {
  return EXPIRATION_MESSAGES.some((expMsg) => 
    message.toLowerCase().includes(expMsg.toLowerCase())
  );
};

const baseQueryWithLogout: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result.error.data as any;
    const message = data?.error || data?.message || "";

    if (isSessionExpired(message)) {
      api.dispatch(logout());

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: [],
  baseQuery: baseQueryWithLogout,
  endpoints: () => ({}),
});
