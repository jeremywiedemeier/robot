import React from "react";

const Head: React.FC<{ angle: number }> = ({ angle }) => {
  return (
    <div
      id="head"
      style={{ transform: `translate(-50%, -100%) rotate(${angle - 90}deg)` }}
    />
  );
};

export default Head;
