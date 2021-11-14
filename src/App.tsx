import React from "react";
import "./App.css";
import Controller from "./components/Controller";
import RobotAnimation from "./components/RobotAnimation";

const App: React.FC = () => {
  return (
    <div id="app">
      {/* <RobotAnimation /> */}
      <Controller />
    </div>
  );
};

export default App;
