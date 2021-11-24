import React from "react";
import { useSelector } from "react-redux";
import { selectTelemetry } from "../../AppSlice";
import Wheel from "./Wheel";
import Head from "./Head";

import "./Telemetry.css";

const Telemetry: React.FC = () => {
  const { motor, servo } = useSelector(selectTelemetry);
  return (
    <div id="telemetry">
      <div id="robot-wrapper">
        <Head angle={servo.x} />
        <Wheel duty={motor.fl} />
        <Wheel duty={motor.fr} />
        <Wheel duty={motor.bl} />
        <Wheel duty={motor.br} />
      </div>
    </div>
  );
};

export default Telemetry;
