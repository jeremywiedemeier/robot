import React, { useEffect } from "react";

const Head: React.FC<{ angle: number; distance: number }> = ({
  angle,
  distance,
}) => {
  const isClose = distance < 10 && distance !== 0;

  useEffect(() => {
    if (distance !== 0) {
      document.getElementById("head")?.classList.remove("fade");
      setTimeout(() => {
        document.getElementById("head")?.classList.add("fade");
      }, 100);
    }
  }, [distance]);

  return (
    <div
      id="head"
      className="fade"
      style={{
        transform: `translate(-50%, -100%) rotate(${angle - 90}deg)`,
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
