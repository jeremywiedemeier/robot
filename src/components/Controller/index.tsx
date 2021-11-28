import React, { useContext, useEffect, useState } from "react";

import {
  addEventListeners,
  ControlState,
  DEFAULT_WHEEL_POWER,
} from "./ControllerHelpers";

import { WebSocketContext } from "../../WebSocket";
import ConnectionStatus from "../Shared/ConnectionStatus";
import WASDKeys from "./WASDKeys";
import PowerControls from "./PowerControls";

import "./Controller.css";

const Controller: React.FC = () => {
  const { socket } = useContext(WebSocketContext);

  const [controlState, setControlState] = useState<ControlState>({
    activeKeys: [],
    wheelPower: DEFAULT_WHEEL_POWER,
    servo: { x: 90 },
  });

  useEffect(addEventListeners(setControlState, socket), []);

  return (
    <div id="controller">
      <ConnectionStatus />

      <div id="module-wrapper">
        <WASDKeys activeKeys={controlState.activeKeys} />
        <PowerControls setControlState={setControlState} />
      </div>
    </div>
  );
};

export default Controller;
