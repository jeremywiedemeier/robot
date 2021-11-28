import React from "react";

const Head: React.FC<{ angle: number; distance: number }> = ({
  angle,
  distance,
}) => {
  const isClose = distance < 10 && distance !== 0;
  return (
    <div
      id="head"
      style={{
        transform: `translate(-50%, -100%) rotate(${angle - 90}deg)`,
        borderColor: isClose ? "var(--red)" : "var(--purp2)",
      }}
    >
      <span
        style={{
          display: distance === 0 ? "none" : "initial",
          top: `${Math.min(Math.max(10, 100 - distance), 90)}%`,
          color: isClose ? "var(--red)" : "var(--purp7)",
          fontSize: `${Math.min(Math.max(20, -0.16 * distance + 36), 36)}px`,
        }}
      >
        {Math.round(distance)}
      </span>
    </div>
  );
};

export default Head;
