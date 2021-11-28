import React, { createContext } from "react";
import { useDispatch } from "react-redux";
import { setSocketReadyState, setTelemetry } from "./AppSlice";
import { WEBSOCKET_URL } from "./resources";

const WebSocketContext = createContext<ContextValue>({ socket: null });

const getWebSocketReadyState = (readyState: number | undefined) => {
  switch (readyState) {
    case 0:
      return "connecting";
    case 1:
      return "open";
    case 3:
    default:
      return "closed";
  }
};

export { WebSocketContext };

const WebSocketProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();

  let socket: WebSocket | null = null;

  const connectWebSocket = () => {
    dispatch(setSocketReadyState("connecting"));
    socket = new WebSocket(WEBSOCKET_URL);
    socket.onopen = () => {
      dispatch(setSocketReadyState(getWebSocketReadyState(socket?.readyState)));
    };
    socket.onmessage = (evt) => {
      dispatch(setTelemetry(JSON.parse(evt.data)));
    };
    socket.onclose = () => {
      dispatch(setSocketReadyState(getWebSocketReadyState(socket?.readyState)));
    };
  };

  if (!socket) {
    connectWebSocket();
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
