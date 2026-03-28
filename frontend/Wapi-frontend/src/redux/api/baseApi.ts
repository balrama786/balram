import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { getSession, signOut } from "next-auth/react";
import { setLogout } from "../reducers/authSlice";
import { resetChatState } from "../reducers/messenger/chatSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

const EXPIRATION_MESSAGES = ["Session expired or logged out", "Token is invalid or expired", "Session expired", "Token expired", "Please log in again", "Invalid token: user not found"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sessionPromise: Promise<any> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000;

const getCachedSession = async () => {
  const now = Date.now();
  if (!sessionPromise || now - lastFetchTime > CACHE_DURATION) {
    lastFetchTime = now;
    sessionPromise = getSession();
  }
  return sessionPromise;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    const session = await getCachedSession();
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }
    return headers;
  },
});

const isSessionExpired = (message: string): boolean => {
  return EXPIRATION_MESSAGES.some((expMsg) => message.toLowerCase().includes(expMsg.toLowerCase()));
};

const baseQueryWithLogout: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result.error.data as any;
    const message = data?.error || data?.message || "";

    if (isSessionExpired(message)) {
      api.dispatch(resetChatState());
      api.dispatch(setLogout());

      signOut({ callbackUrl: "/auth/login", redirect: true });
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
