import React, { createContext, useEffect, useState } from "react";
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

  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (socket === null) {
      dispatch(setSocketReadyState("connecting"));
      setSocket(() => {
        const newSocket = new WebSocket(WEBSOCKET_URL);
        newSocket.onopen = () => {
          dispatch(
            setSocketReadyState(getWebSocketReadyState(newSocket?.readyState))
          );
        };
        newSocket.onmessage = (evt) => {
          dispatch(setTelemetry(JSON.parse(evt.data)));
        };
        newSocket.onclose = () => {
          dispatch(
            setSocketReadyState(getWebSocketReadyState(newSocket?.readyState))
          );
        };
        return newSocket;
      });
    }
    return () => {
      setSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
