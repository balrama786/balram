import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Helper to get initial state from localStorage
const getInitialSidebarState = (): boolean => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("sidebarToggle");
    return stored === "true";
  }
  return false;
};

const getInitialRTLState = (): boolean => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("isRTL");
    return stored === "true";
  }
  return false;
};

const initialState = {
  sidebarToggle: getInitialSidebarState(),
  isMobileSidebarOpen: false,
  isRTL: getInitialRTLState(),
  sidebarHover: false,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState, 
  reducers: {
    setSidebarToggle: (state, action: PayloadAction<boolean | undefined>) => {
      state.sidebarToggle = typeof action.payload === "boolean" ? action.payload : !state.sidebarToggle;
      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebarToggle", String(state.sidebarToggle));
      }
    }, 
    setMobileSidebarOpen: (state, action: PayloadAction<boolean | undefined>) => {
      state.isMobileSidebarOpen = typeof action.payload === "boolean" ? action.payload : !state.isMobileSidebarOpen;
    },
    closeMobileSidebar: (state) => {
      state.isMobileSidebarOpen = false;
    },
    setRTL: (state, action: PayloadAction<boolean | undefined>) => {
      state.isRTL = typeof action.payload === "boolean" ? action.payload : !state.isRTL;
      if (typeof window !== "undefined") {
        localStorage.setItem("isRTL", String(state.isRTL));
      }
    },
    setSidebarHover: (state, action: PayloadAction<boolean>) => {
      state.sidebarHover = action.payload;
    }
  },
});
 
export const { setSidebarToggle, setMobileSidebarOpen, closeMobileSidebar, setRTL, setSidebarHover } = layoutSlice.actions;

export default layoutSlice.reducer;
