import React from "react";
import { useSelector } from "react-redux";
import { selectSocketReadyState } from "../../AppSlice";

import signal from "../../assets/signal.png";

import "./ConnectionStatus.css";

const ConnectionStatus: React.FC = () => {
  const readyState = useSelector(selectSocketReadyState);

  return (
    <button type="button" id="connection-status" className={readyState}>
      <img src={signal} alt={`Web socket ${readyState}`} />
    </button>
  );
};

export default ConnectionStatus;
