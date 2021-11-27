import React from "react";
import Controller from "./components/Controller";
import Telemetry from "./components/Telemetry";

import "./App.css";

const App: React.FC = () => {
  return (
    <div id="app">
      <Controller />
      <Telemetry />
    </div>
  );
};

export default App;
