/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import { RootState } from "./store";

interface AppState {
  telemetry: {
    motor: {
      fl: number | undefined;
      fr: number | undefined;
      bl: number | undefined;
      br: number | undefined;
    };
  };
}

const initialState: AppState = {
  telemetry: {
    motor: { fl: undefined, fr: undefined, bl: undefined, br: undefined },
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
