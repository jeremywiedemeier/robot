import React from "react";
import { useSelector } from "react-redux";

import Wheel from "./Wheel";
import Head from "./Head";
import Buzzer from "./Buzzer";
import ConnectionStatus from "../Shared/ConnectionStatus";

import { selectTelemetry } from "../../AppSlice";

import "./Telemetry.css";

const Telemetry: React.FC = () => {
  const { motor, servo, buzzer, ultrasound } = useSelector(selectTelemetry);

  return (
    <div id="telemetry">
      <div id="robot-wrapper">
        <Wheel duty={motor.fl} />
        <Wheel duty={motor.fr} />
        <Wheel duty={motor.bl} />
        <Wheel duty={motor.br} />
        <Head angle={servo.x} distance={ultrasound.last_measurement || 0} />
        <ConnectionStatus />
        <Buzzer active={buzzer.active} />
      </div>
    </div>
  );
};

export default Telemetry;
