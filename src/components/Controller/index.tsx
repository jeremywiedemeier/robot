import React, { useContext, useEffect, useState } from "react";
import { CONTROL_KEYS } from "../../resources";
import { WebSocketContext } from "../../WebSocket";
import WASDKeys from "./WASDKeys";

import "./Controller.css";

const handleKeyDown =
  (
    setActiveKeys: React.Dispatch<React.SetStateAction<string[]>>,
    activeKeysToControl: (keys: string[]) => Input,
    socket: WebSocket | null
  ) =>
  (evt: KeyboardEvent) => {
    if (CONTROL_KEYS.includes(evt.key))
      setActiveKeys((currentActiveKeys) => {
        // If key is already in activeKeys, do nothing
        if (currentActiveKeys.includes(evt.key)) return currentActiveKeys;

        const newActiveKeys = [...currentActiveKeys, evt.key];

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(activeKeysToControl(newActiveKeys)));
        }
        return newActiveKeys;
      });
  };

const handleKeyUp =
  (
    setActiveKeys: React.Dispatch<React.SetStateAction<string[]>>,
    activeKeysToControl: (keys: string[]) => Input,
    socket: WebSocket | null
  ) =>
  (evt: KeyboardEvent) => {
    if (CONTROL_KEYS.includes(evt.key))
      setActiveKeys((currentActiveKeys) => {
        const newActiveKeys = currentActiveKeys.filter(
          (key) => key !== evt.key
        );
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(activeKeysToControl(newActiveKeys)));
        }
        return newActiveKeys;
      });
  };

const Controller: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const { socket } = useContext(WebSocketContext);

  useEffect(() => {
    const activeKeysToControl = (keys: string[]): Input => {
      let motor: Input["motor"] = { fl: 0, fr: 0, bl: 0, br: 0 };

      if (keys.includes("s")) {
        motor = { fl: -1000, fr: -1000, bl: -1000, br: -1000 };
      } else if (keys.includes("a")) {
        motor = { fl: -500, fr: 2000, bl: -500, br: 2000 };
      } else if (keys.includes("d")) {
        motor = { fl: 2000, fr: -500, bl: 2000, br: -500 };
      } else if (keys.includes("w")) {
        motor = { fl: 1000, fr: 1000, bl: 1000, br: 1000 };
      }

      return { motor };
    };

    document.addEventListener(
      "keydown",
      handleKeyDown(setActiveKeys, activeKeysToControl, socket)
    );
    document.addEventListener(
      "keyup",
      handleKeyUp(setActiveKeys, activeKeysToControl, socket)
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown(setActiveKeys, activeKeysToControl, socket)
      );
      document.removeEventListener(
        "keyup",
        handleKeyUp(setActiveKeys, activeKeysToControl, socket)
      );
    };
  }, [socket]);

  return (
    <div id="controller">
      <WASDKeys activeKeys={activeKeys} />
    </div>
  );
};

interface Input {
  motor: { fl: number; fr: number; bl: number; br: number };
}

export default Controller;
