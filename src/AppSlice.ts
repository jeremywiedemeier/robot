/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import { RootState } from "./store";

interface AppState {
  socketReadyState: "connecting" | "open" | "closed";
  telemetry: {
    motor: {
      fl: number;
      fr: number;
      bl: number;
      br: number;
    };
    servo: {
      x: number;
    };
    buzzer: {
      active: boolean;
    };
    ultrasound: {
      last_measurement: number | null;
    };
  };
}

const initialState: AppState = {
  socketReadyState: "connecting",
  telemetry: {
    motor: { fl: 0, fr: 0, bl: 0, br: 0 },
    servo: { x: 90 },
    buzzer: { active: false },
    ultrasound: { last_measurement: null },
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
    setSocketReadyState: (
      state: AppState,
      action: PayloadAction<AppState["socketReadyState"]>
    ) => {
      state.socketReadyState = action.payload;
    },
  },
});

export const { setTelemetry, setSocketReadyState } = AppSlice.actions;

export const selectTelemetry = (state: RootState): AppState["telemetry"] =>
  state.app.telemetry;

export const selectSocketReadyState = (
  state: RootState
): AppState["socketReadyState"] => state.app.socketReadyState;

export default AppSlice.reducer;
