export const CONTROL_KEYS = ["q", "w", "e", "a", "s", "d", "z", "x", "c"];

export const WEBSOCKET_URL = `ws://${
  // Production app is hosted on the robot's rpi
  process.env.NODE_ENV === "production" ? window.location.hostname : "nastberry"
}:8765`;
