import React from "react";
import "./App.css";
import Controller from "./components/Controller";
import Telemetry from "./components/Telemetry";

const App: React.FC = () => {
  return (
    <div id="app">
      <Controller />
      <Telemetry />
    </div>
  );
};

export default App;
