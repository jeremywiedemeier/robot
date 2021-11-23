import React from "react";
import "./WASDKeys.css";

const WASDKeys: React.FC<Props> = ({ activeKeys }) => {
  return (
    <div id="wasd-keys">
      <div>
        <div className={`key ${activeKeys.includes("q") ? "active" : ""}`}>
          Q
        </div>
        <div className={`key ${activeKeys.includes("w") ? "active" : ""}`}>
          W
        </div>
        <div className={`key ${activeKeys.includes("e") ? "active" : ""}`}>
          E
        </div>
      </div>
      <div>
        <div className={`key ${activeKeys.includes("a") ? "active" : ""}`}>
          A
        </div>
        <div className={`key ${activeKeys.includes("s") ? "active" : ""}`}>
          S
        </div>
        <div className={`key ${activeKeys.includes("d") ? "active" : ""}`}>
          D
        </div>
      </div>
      <div>
        <div className={`key ${activeKeys.includes("z") ? "active" : ""}`}>
          Z
        </div>
        <div className={`key ${activeKeys.includes("x") ? "active" : ""}`}>
          X
        </div>
        <div className={`key ${activeKeys.includes("c") ? "active" : ""}`}>
          C
        </div>
      </div>
    </div>
  );
};

interface Props {
  activeKeys: string[];
}

export default WASDKeys;
