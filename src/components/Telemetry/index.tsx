import React from "react";
import { useSelector } from "react-redux";
import { selectTelemetry } from "../../AppSlice";
import Wheel from "./Wheel";
import Head from "./Head";

import "./Telemetry.css";
import Buzzer from "./Buzzer";

const Telemetry: React.FC = () => {
  const { motor, servo, buzzer } = useSelector(selectTelemetry);
  return (
    <div id="telemetry">
      <div id="robot-wrapper">
        <Wheel duty={motor.fl} />
        <Wheel duty={motor.fr} />
        <Wheel duty={motor.bl} />
        <Wheel duty={motor.br} />
        <Head angle={servo.x} />
        <Buzzer active={buzzer.active} />
      </div>
    </div>
  );
};

export default Telemetry;
