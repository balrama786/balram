import { AuthState, User, PermissionGroup } from "@/src/types/auth";
import { authUtils } from "@/src/utils/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  authRedirectField: "",
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Store in localStorage
      authUtils.setToken(action.payload.token);
      authUtils.setUser(action.payload.user);
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      authUtils.setUser(action.payload);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.permissions = [];

      // Clear localStorage
      authUtils.clearAuth();
    },

    setPermissions: (state, action: PayloadAction<PermissionGroup[]>) => {
      state.permissions = action.payload;
    },

    setAuthRedirectField: (state, action) => {
      state.authRedirectField = action.payload;
    },
    initializeAuth: (state) => {
      const token = authUtils.getToken();
      const user = authUtils.getUser();

      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { 
  setCredentials, 
  setUser, 
  setLoading, 
  logout, 
  initializeAuth, 
  setAuthRedirectField,
  setPermissions
} = authSlice.actions;

export default authSlice.reducer;
