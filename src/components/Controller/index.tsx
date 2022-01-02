import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectTelemetry } from "../../AppSlice";
import { clone } from "../../resources";
import {
  addEventListeners,
  ControlState,
  controlStateToInput,
  DEFAULT_CONTROL_STATE,
  MIN_DIST,
  TIME_DELTA,
} from "./ControllerHelpers";

import { WebSocketContext } from "../../WebSocket";

import ConnectionStatus from "../Shared/ConnectionStatus";
import WASDKeys from "./WASDKeys";
import PowerControls from "./PowerControls";

import "./Controller.css";

const Controller: React.FC = () => {
  const { socket } = useContext(WebSocketContext);

  // Get server state for automated control
  const { servo, ultrasound } = useSelector(selectTelemetry);

  const [controlState, setControlState] = useState<ControlState>(
    clone(DEFAULT_CONTROL_STATE)
  );

  // Add event listeners for user input, update controlState
  useEffect(addEventListeners(setControlState), []);

  // Listen for changes to controlState, then send to server
  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(controlStateToInput(controlState)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlState]);

  // Unpress single action buttons
  useEffect(() => {
    setControlState((currentControlState) => {
      return {
        ...currentControlState,
        activeKeys: currentControlState.activeKeys.filter(
          (key) => !["q", "e", "z"].includes(key)
        ),
      };
    });
  }, [servo.x, ultrasound.last_measurement]);

  // Automated control loop
  useEffect(() => {
    if (controlState.controlMode === "random") {
      setControlState((currentControlState) => {
        if (currentControlState.random.stage === "travelling") {
          // Travel forward and take constant proximity readings until it
          // falls below the defined minimum
          if (
            ultrasound.last_measurement &&
            ultrasound.last_measurement < MIN_DIST
          ) {
            // Stop and move to the turning stage
            return {
              ...currentControlState,
              activeKeys: [],
              random: { ...currentControlState.random, stage: "turning" },
            };
          }

          // Perform a proxmity scan after a time cycle
          setTimeout(() => {
            setControlState((laterControlState) => {
              return {
                ...laterControlState,
                activeKeys: [...laterControlState.activeKeys, "z"],
              };
            });
          }, TIME_DELTA);

          // Move forward
          return {
            ...currentControlState,
            activeKeys: ["w"],
          };
        }

        if (currentControlState.random.stage === "turning") {
          // Turn for a random amount of time, proximity scan in that direction
          return currentControlState;
        }

        console.error("logical error--reached end of automatic control loop");
        return currentControlState;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    controlState.controlMode,
    controlState.random.stage,
    ultrasound.last_measurement,
  ]);

  // controlState cleanup
  useEffect(
    () => () => {
      setControlState(clone(DEFAULT_CONTROL_STATE));
    },
    []
  );

  return (
    <div id="controller">
      <ConnectionStatus />

      <div id="module-wrapper">
        <WASDKeys activeKeys={controlState.activeKeys} />
        <PowerControls setControlState={setControlState} />

        <div id="control-mode-selector">
          {(["manual", "random"] as ControlState["controlMode"][]).map(
            (controlMode) => (
              <button
                type="button"
                key={controlMode}
                className={
                  controlState.controlMode === controlMode ? "active" : ""
                }
                onClick={() => {
                  setControlState({
                    ...controlState,
                    controlMode,
                  });
                }}
              >
                {controlMode.slice(0, 1).toUpperCase() + controlMode.slice(1)}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Controller;
