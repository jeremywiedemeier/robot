import React from "react";
import "./WASDKeys.css";

const WASDKeys: React.FC<Props> = ({ activeKeys }) => {
  return (
    <div id="wasd-keys">
      {[
        ["q", "w", "e"],
        ["a", "s", "d"],
        ["z", "x", "c"],
      ].map((keyRow) => (
        <div key={keyRow.join()}>
          {keyRow.map((letter) => (
            <button
              type="button"
              key={letter}
              data-letter={letter}
              className={`key ${activeKeys.includes(letter) ? "active" : ""}`}
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

interface Props {
  activeKeys: string[];
}

export default WASDKeys;
