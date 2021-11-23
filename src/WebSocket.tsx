import React, { createContext } from "react";
import { useDispatch } from "react-redux";
import { setTelemetry } from "./AppSlice";
import { WEBSOCKET_URL } from "./resources";

const WebSocketContext = createContext<ContextValue>({ socket: null });

export { WebSocketContext };

const WebSocketProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();

  let socket: WebSocket | null = null;

  if (!socket) {
    console.log("opening websocket");
    socket = new WebSocket(WEBSOCKET_URL);
    socket.onopen = () => {
      console.log("websocket opened");
    };
    socket.onmessage = (evt) => {
      dispatch(setTelemetry(JSON.parse(evt.data)));
    };
    socket.onclose = () => {
      console.log("websocket closed");
    };
  }

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

interface ContextValue {
  socket: WebSocket | null;
}

export default WebSocketProvider;
