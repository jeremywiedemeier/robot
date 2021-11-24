import React, { useContext, useEffect, useState } from "react";
import { CONTROL_KEYS } from "../../resources";
import { WebSocketContext } from "../../WebSocket";
import WASDKeys from "./WASDKeys";

import "./Controller.css";

const controlStateToInput = (controlState: ControlState): Input => {
  let motor: Input["motor"] = { fl: 0, fr: 0, bl: 0, br: 0 };

  if (controlState.activeKeys.includes("s")) {
    motor = { fl: -1000, fr: -1000, bl: -1000, br: -1000 };
  } else if (controlState.activeKeys.includes("a")) {
    motor = { fl: -500, fr: 2000, bl: -500, br: 2000 };
  } else if (controlState.activeKeys.includes("d")) {
    motor = { fl: 2000, fr: -500, bl: 2000, br: -500 };
  } else if (controlState.activeKeys.includes("w")) {
    motor = { fl: 1000, fr: 1000, bl: 1000, br: 1000 };
  }

  const servo: Input["servo"] = { x: controlState.servo.x };

  return { motor, servo };
};

const handleKeyDown =
  (
    setControlState: React.Dispatch<React.SetStateAction<ControlState>>,
    socket: WebSocket | null
  ) =>
  (evt: KeyboardEvent) => {
    if (CONTROL_KEYS.includes(evt.key))
      setControlState((currentControlState) => {
        let newControlState: ControlState = { ...currentControlState };

        // For movement controls,
        if (["w", "a", "s", "d"].includes(evt.key)) {
          // If duplicate, ignore state change and break
          if (currentControlState.activeKeys.includes(evt.key))
            return currentControlState;

          // Else add movement control to activeKeys
          newControlState = {
            ...currentControlState,
            activeKeys: [...currentControlState.activeKeys, evt.key],
          };
        }

        // For servo controls, adjust angle and append to active keys
        else if (["q", "e"].includes(evt.key)) {
          newControlState = {
            ...currentControlState,
            servo: {
              x: Math.max(
                Math.min(
                  currentControlState.servo.x + (evt.key === "q" ? -5 : 5),
                  120
                ),
                60
              ),
            },
            activeKeys: currentControlState.activeKeys.includes(evt.key)
              ? currentControlState.activeKeys
              : [...currentControlState.activeKeys, evt.key],
          };
        }

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(controlStateToInput(newControlState)));
        }

        return newControlState;
      });
  };

const handleKeyUp =
  (
    setControlState: React.Dispatch<React.SetStateAction<ControlState>>,
    socket: WebSocket | null
  ) =>
  (evt: KeyboardEvent) => {
    if (CONTROL_KEYS.includes(evt.key))
      setControlState((currentControlState) => {
        const newControlState = {
          ...currentControlState,
          activeKeys: currentControlState.activeKeys.filter(
            (key) => key !== evt.key
          ),
        };

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(controlStateToInput(newControlState)));
        }
        return newControlState;
      });
  };

const Controller: React.FC = () => {
  const [controlState, setControlState] = useState<ControlState>({
    activeKeys: [],
    servo: { x: 90 },
  });

  const { socket } = useContext(WebSocketContext);

  useEffect(() => {
    document.addEventListener(
      "keydown",
      handleKeyDown(setControlState, socket)
    );
    document.addEventListener("keyup", handleKeyUp(setControlState, socket));

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown(setControlState, socket)
      );
      document.removeEventListener(
        "keyup",
        handleKeyUp(setControlState, socket)
      );
    };
  }, [socket]);

  return (
    <div id="controller">
      <WASDKeys activeKeys={controlState.activeKeys} />
    </div>
  );
};

interface Input {
  motor: { fl: number; fr: number; bl: number; br: number };
  servo: { x: number };
}

interface ControlState {
  activeKeys: string[];
  servo: { x: number };
}

export default Controller;
