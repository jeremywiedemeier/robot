import React, { useContext, useEffect, useState } from "react";
import { CONTROL_KEYS } from "../../resources";
import { WebSocketContext } from "../../WebSocket";
import WASDKeys from "./WASDKeys";

const handleKeyDown =
  (
    setActiveKeys: React.Dispatch<React.SetStateAction<string[]>>,
    socket: WebSocket | null
  ) =>
  (evt: KeyboardEvent) => {
    if (CONTROL_KEYS.includes(evt.key))
      setActiveKeys((currentActiveKeys) => {
        if (currentActiveKeys.includes(evt.key)) {
          return currentActiveKeys;
        }
        const newActiveKeys = [...currentActiveKeys, evt.key];
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(newActiveKeys.join());
        }
        return newActiveKeys;
      });
  };

const handleKeyUp =
  (
    setActiveKeys: React.Dispatch<React.SetStateAction<string[]>>,
    socket: WebSocket | null
  ) =>
  (evt: KeyboardEvent) => {
    if (CONTROL_KEYS.includes(evt.key))
      setActiveKeys((currentActiveKeys) => {
        const newActiveKeys = currentActiveKeys.filter(
          (key) => key !== evt.key
        );
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(newActiveKeys.join());
        }
        return newActiveKeys;
      });
  };

const Controller: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const { socket } = useContext(WebSocketContext);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown(setActiveKeys, socket));
    document.addEventListener("keyup", handleKeyUp(setActiveKeys, socket));

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown(setActiveKeys, socket)
      );
      document.removeEventListener("keyup", handleKeyUp(setActiveKeys, socket));
    };
  }, [socket]);

  return (
    <div>
      <WASDKeys activeKeys={activeKeys} />
    </div>
  );
};

export default Controller;
