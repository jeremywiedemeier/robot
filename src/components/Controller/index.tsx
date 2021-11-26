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

  const buzzer: Input["buzzer"] = {
    active: controlState.activeKeys.includes("c"),
  };

  return { motor, servo, buzzer };
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

        // For movement controls, if duplicate, ignore state change and break
        if (
          ["w", "a", "s", "d"].includes(evt.key) &&
          currentControlState.activeKeys.includes(evt.key)
        ) {
          return currentControlState;
        }

        // For servo controls, adjust angle
        if (["q", "e"].includes(evt.key)) {
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
          };
        }

        // Append keydown to activekeys if needed
        newControlState.activeKeys = currentControlState.activeKeys.includes(
          evt.key
        )
          ? currentControlState.activeKeys
          : [...currentControlState.activeKeys, evt.key];

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
        // Update activekeys and send
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
  buzzer: { active: boolean };
}

interface ControlState {
  activeKeys: string[];
  servo: { x: number };
}

export default Controller;
