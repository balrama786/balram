import { AuthState } from "@/src/types/auth";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
  authRedirectField: "",
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthRedirectField: (state, action) => {
      state.authRedirectField = action.payload;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setAuthRedirectField, setCredentials, setLogout, stopLoading, updateUser } = authSlice.actions;

export default authSlice.reducer;
