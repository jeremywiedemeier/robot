export const WEBSOCKET_URL = `ws://${
  // Production app is hosted on the robot's rpi
  process.env.NODE_ENV === "production" ? window.location.hostname : "nastberry"
}:8765`;

// Deep clones all properties except functions
export const clone = (obj: any) => {
  if (typeof obj === "function") {
    return obj;
  }
  const result: Record<string, any> = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach((key) => {
    // include prototype properties
    const value = obj[key];
    const type = {}.toString.call(value).slice(8, -1);
    if (type === "Array" || type === "Object") {
      result[key] = clone(value);
    } else if (type === "Date") {
      result[key] = new Date(value.getTime());
    } else {
      result[key] = value;
    }
  });
  return result;
};
