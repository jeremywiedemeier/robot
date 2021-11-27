import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../WebSocket";

import {
  addEventListeners,
  ControlState,
  DEFAULT_WHEEL_POWER,
  validatePower,
} from "./ControllerHelpers";

import WASDKeys from "./WASDKeys";

import powerIcon from "../../assets/power.png";
import upDownArrows from "../../assets/up-down-arrows.png";
import turnArrow from "../../assets/turn-arrow.png";
import "./Controller.css";
import ConnectionStatus from "../Shared/ConnectionStatus";

const Controller: React.FC = () => {
  const [controlState, setControlState] = useState<ControlState>({
    activeKeys: [],
    wheelPower: DEFAULT_WHEEL_POWER,
    servo: { x: 90 },
  });

  const [unvalidatedWheelPower, setUnvalidatedWheelPower] =
    useState(DEFAULT_WHEEL_POWER);

  const { socket } = useContext(WebSocketContext);

  useEffect(addEventListeners(setControlState, socket), [socket]);

  return (
    <div id="controller">
      <ConnectionStatus />
      <WASDKeys activeKeys={controlState.activeKeys} />
      <div id="power-controls">
        {Object.entries(unvalidatedWheelPower).map(([powerIndex, power]) => (
          <input
            type="text"
            key={powerIndex}
            value={power}
            onKeyPress={(event) => {
              if (event.key === "Enter")
                (event.target as HTMLInputElement).blur();
            }}
            onChange={(input) => {
              setUnvalidatedWheelPower((prevWheelPower) => ({
                ...prevWheelPower,
                [powerIndex]: input.target.value,
              }));
            }}
            onBlur={() => {
              const validatedWheelPower = {
                ...unvalidatedWheelPower,
                [powerIndex]: validatePower(
                  powerIndex as "p0" | "p1" | "p2",
                  power
                ),
              };

              setUnvalidatedWheelPower(validatedWheelPower);
              setControlState((prevControlState) => ({
                ...prevControlState,
                wheelPower: validatedWheelPower,
              }));
            }}
          />
        ))}
        <img
          src={upDownArrows}
          alt="forward/reverse arrows"
          id="up-down-arrow"
        />
        <img src={turnArrow} alt="turning arrow" id="turning-arrow" />
        <img src={powerIcon} alt="power" />
      </div>
    </div>
  );
};

export default Controller;
