/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import { RootState } from "./store";

interface AppState {
  telemetry: {
    motor: {
      fl: number;
      fr: number;
      bl: number;
      br: number;
    };
  };
}

const initialState: AppState = {
  telemetry: {
    motor: { fl: 0, fr: 0, bl: 0, br: 0 },
  },
};

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTelemetry: (
      state: AppState,
      action: PayloadAction<AppState["telemetry"]>
    ) => {
      state.telemetry = action.payload;
    },
  },
});

export const { setTelemetry } = AppSlice.actions;

export const selectTelemetry = (state: RootState): AppState["telemetry"] =>
  state.app.telemetry;

export default AppSlice.reducer;
