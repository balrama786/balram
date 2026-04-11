import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppSettings } from "../api/settingApi";

interface SettingsState {
  data: Partial<AppSettings>;
  errors: Record<string, string>;
  isDirty: boolean;
  pageTitle: string;
}

const initialState: SettingsState = {
  data: {},
  errors: {},
  isDirty: false,
  pageTitle: "",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.data = action.payload;
      state.isDirty = false;
      state.errors = {};
    },
    updateSettingField: (state, action: PayloadAction<{ key: keyof AppSettings; value: AppSettings[keyof AppSettings] | string }>) => {
      state.data = { ...state.data, [action.payload.key]: action.payload.value };
      state.isDirty = true;
    },
    updateSettingError: (state, action: PayloadAction<{ key: string; error: string | null }>) => {
      if (action.payload.error) {
        state.errors[action.payload.key] = action.payload.error;
      } else {
        delete state.errors[action.payload.key];
      }
    },
    resetDirty: (state) => {
      state.isDirty = false;
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
  },
});

export const { setSettings, updateSettingField, updateSettingError, resetDirty, setPageTitle } = settingsSlice.actions;
export default settingsSlice.reducer;
