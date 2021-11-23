import React from "react";

const Wheel: React.FC<{ duty: number }> = ({ duty }) => {
  return (
    <div className="wheel">
      <div
        className="wheel-power-indicator"
        style={{ transform: `scaleY(${duty / 2000})` }}
      />
    </div>
  );
};

export default Wheel;
