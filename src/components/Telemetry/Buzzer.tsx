import React from "react";
import volume from "../../assets/volume.png";

const Buzzer: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div id="buzzer">
      <img src={volume} alt="buzzer" className={active ? "active" : ""} />
    </div>
  );
};

export default Buzzer;
