import { configureStore } from "@reduxjs/toolkit";
import dashboardSlice from "./reducers/dashboardSlice";
import authReducer from "./reducers/authSlice";
import { baseApi } from "./api/baseApi";
import layoutSlice from "./reducers/layoutSlice";
import settingsReducer from "./reducers/settingsSlice";

const Store = configureStore({
  reducer: {
    dashboard: dashboardSlice,
    auth: authReducer,
    layout: layoutSlice,
    settings: settingsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
