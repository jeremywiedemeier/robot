import React, { useState } from "react";
import {
  ControlState,
  DEFAULT_WHEEL_POWER,
  validatePower,
} from "./ControllerHelpers";

import powerIcon from "../../assets/power.png";
import upDownArrows from "../../assets/up-down-arrows.png";
import turnArrow from "../../assets/turn-arrow.png";

import "./PowerControls.css";

const PowerControls: React.FC<{
  setControlState: React.Dispatch<React.SetStateAction<ControlState>>;
}> = ({ setControlState }) => {
  const [unvalidatedWheelPower, setUnvalidatedWheelPower] =
    useState(DEFAULT_WHEEL_POWER);

  return (
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
      <img src={upDownArrows} alt="forward/reverse arrows" id="up-down-arrow" />
      <img src={turnArrow} alt="turning arrow" id="turning-arrow" />
      <img src={powerIcon} alt="power" />
    </div>
  );
};

export default PowerControls;
