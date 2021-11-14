import React, { useEffect, useState } from "react";

const handleKeyDown =
  (setActiveKeys: React.Dispatch<React.SetStateAction<string[]>>) =>
  (evt: KeyboardEvent) => {
    if (["w", "a", "s", "d"].includes(evt.key))
      setActiveKeys((currentActiveKeys) => {
        const newActiveKeys = [...currentActiveKeys, evt.key];
        return newActiveKeys;
      });
  };

const handleKeyUp =
  (setActiveKeys: React.Dispatch<React.SetStateAction<string[]>>) =>
  (evt: KeyboardEvent) => {
    if (["w", "a", "s", "d"].includes(evt.key))
      setActiveKeys((currentActiveKeys) => {
        const newActiveKeys = currentActiveKeys.filter(
          (key) => key !== evt.key
        );
        return newActiveKeys;
      });
  };

const Controller: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown(setActiveKeys));
    document.addEventListener("keyup", handleKeyUp(setActiveKeys));

    return () => {
      document.removeEventListener("keydown", handleKeyDown(setActiveKeys));
      document.removeEventListener("keyup", handleKeyUp(setActiveKeys));
    };
  }, []);

  return <div>{activeKeys}</div>;
};

export default Controller;
