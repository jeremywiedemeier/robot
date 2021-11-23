import React, { useEffect, useRef, useState } from "react";

const handleKeyDown =
  (
    setActiveKeys: React.Dispatch<React.SetStateAction<string[]>>,
    socket: WebSocket | null
  ) =>
  (evt: KeyboardEvent) => {
    if (["w", "a", "s", "d"].includes(evt.key))
      setActiveKeys((currentActiveKeys) => {
        if (currentActiveKeys.includes(evt.key)) {
          return currentActiveKeys;
        }
        const newActiveKeys = [...currentActiveKeys, evt.key];
        if (socket) {
          console.log(
            `keydown ${evt.key}, sending active keys ${newActiveKeys.join()}`
          );
          socket.send(newActiveKeys.join());
        }
        return newActiveKeys;
      });
  };

const handleKeyUp =
  (
    setActiveKeys: React.Dispatch<React.SetStateAction<string[]>>,
    socket: WebSocket | null
  ) =>
  (evt: KeyboardEvent) => {
    if (["w", "a", "s", "d"].includes(evt.key))
      setActiveKeys((currentActiveKeys) => {
        const newActiveKeys = currentActiveKeys.filter(
          (key) => key !== evt.key
        );
        if (socket) {
          console.log(
            `keyup ${evt.key}, sending active keys ${newActiveKeys.join()}`
          );
          socket.send(newActiveKeys.join());
        }
        return newActiveKeys;
      });
  };

const Controller: React.FC = () => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("opening websocket connection");
    socket.current = new WebSocket("ws://nastberry:8765");
    socket.current.onopen = () => {
      console.log("websocket opened");
    };
    socket.current.onmessage = (evt) => {
      console.log(evt.data);
    };
    socket.current.onclose = () => {
      console.log("websocket closed");
    };

    return () => {
      socket.current?.close();
    };
  }, []);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  useEffect(() => {
    console.log("adding event listeners");
    document.addEventListener(
      "keydown",
      handleKeyDown(setActiveKeys, socket.current)
    );
    document.addEventListener(
      "keyup",
      handleKeyUp(setActiveKeys, socket.current)
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown(setActiveKeys, socket.current)
      );
      document.removeEventListener(
        "keyup",
        handleKeyUp(setActiveKeys, socket.current)
      );
    };
  }, []);

  return <div>{activeKeys}</div>;
};

export default Controller;
