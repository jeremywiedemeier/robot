const MOTOR_DUTY_MAX = 4095;

const CONTROL_KEYS = ["q", "w", "e", "a", "s", "d", "z", "x", "c"];

// Stores activeKeys and state variables that need to persist after activeKeys
export interface ControlState {
  activeKeys: string[];
  wheelPower: {
    p0: number;
    p1: number;
    p2: number;
  };
  servo: { x: number };
}

// Controls sent to the server every time controlState changes
export interface Input {
  motor: { fl: number; fr: number; bl: number; br: number };
  servo: { x: number };
  buzzer: { active: boolean };
  ultrasound: { active: boolean };
}

const controlStateToInput = (controlState: ControlState): Input => {
  const { p0, p1, p2 } = controlState.wheelPower;
  let motor: Input["motor"] = { fl: 0, fr: 0, bl: 0, br: 0 };

  if (controlState.activeKeys.includes("s")) {
    // Reverse
    motor = { fl: -p0, fr: -p0, bl: -p0, br: -p0 };
  } else if (controlState.activeKeys.includes("a")) {
    // Left turn
    motor = { fl: -p2, fr: p1, bl: -p2, br: p1 };
  } else if (controlState.activeKeys.includes("d")) {
    // Right turn
    motor = { fl: p1, fr: -p2, bl: p1, br: -p2 };
  } else if (controlState.activeKeys.includes("w")) {
    // Forward
    motor = { fl: p0, fr: p0, bl: p0, br: p0 };
  }

  const servo: Input["servo"] = { x: controlState.servo.x };

  const buzzer: Input["buzzer"] = {
    active: controlState.activeKeys.includes("c"),
  };

  const ultrasound: Input["ultrasound"] = {
    active: controlState.activeKeys.includes("z"),
  };

  return { motor, servo, buzzer, ultrasound };
};

const handleKeyDown =
  (
    setControlState: React.Dispatch<React.SetStateAction<ControlState>>,
    socket: WebSocket | null
  ) =>
  (evt: Event) => {
    const key =
      (evt as KeyboardEvent).key ||
      (evt.target as HTMLElement).getAttribute("data-letter") ||
      "";

    if (CONTROL_KEYS.includes(key))
      setControlState((currentControlState) => {
        let newControlState: ControlState = { ...currentControlState };

        // For movement controls, if duplicate, ignore state change and break
        if (
          ["w", "a", "s", "d"].includes(key) &&
          currentControlState.activeKeys.includes(key)
        ) {
          return currentControlState;
        }

        // For servo controls, adjust angle
        if (["q", "e"].includes(key)) {
          newControlState = {
            ...currentControlState,
            servo: {
              x: Math.max(
                Math.min(
                  currentControlState.servo.x + (key === "q" ? -5 : 5),
                  120
                ),
                60
              ),
            },
          };
        }

        // Append keydown to activekeys if needed
        newControlState.activeKeys = currentControlState.activeKeys.includes(
          key
        )
          ? currentControlState.activeKeys
          : [...currentControlState.activeKeys, key];

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(controlStateToInput(newControlState)));
        }

        return newControlState;
      });
  };

const handleKeyUp =
  (
    setControlState: React.Dispatch<React.SetStateAction<ControlState>>,
    socket: WebSocket | null
  ) =>
  (evt: Event) => {
    const keyToRemove =
      (evt as KeyboardEvent).key ||
      (evt.target as HTMLElement).getAttribute("data-letter") ||
      "";

    if (CONTROL_KEYS.includes(keyToRemove))
      setControlState((currentControlState) => {
        // Update activekeys and send
        const newControlState = {
          ...currentControlState,
          activeKeys: currentControlState.activeKeys.filter(
            (key) => key !== keyToRemove
          ),
        };

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(controlStateToInput(newControlState)));
        }
        return newControlState;
      });
  };

const handleMouseDown =
  (
    setControlState: React.Dispatch<React.SetStateAction<ControlState>>,
    socket: WebSocket | null
  ) =>
  (evt: Event) => {
    handleKeyDown(setControlState, socket)(evt);
  };

const handleMouseUp =
  (
    setControlState: React.Dispatch<React.SetStateAction<ControlState>>,
    socket: WebSocket | null
  ) =>
  (evt: Event) => {
    handleKeyUp(setControlState, socket)(evt);
  };

const handleTouchStart =
  (
    setControlState: React.Dispatch<React.SetStateAction<ControlState>>,
    socket: WebSocket | null
  ) =>
  (evt: Event) => {
    evt.preventDefault();

    handleKeyDown(setControlState, socket)(evt);
  };
const handleTouchEnd = handleMouseUp;

export const addEventListeners =
  (
    setControlState: React.Dispatch<React.SetStateAction<ControlState>>,
    socket: WebSocket | null
  ) =>
  (): (() => void) => {
    document.addEventListener(
      "keydown",
      handleKeyDown(setControlState, socket)
    );
    document.addEventListener("keyup", handleKeyUp(setControlState, socket));

    Array.from(document.getElementsByClassName("key")).forEach((element) => {
      element.addEventListener(
        "mousedown",
        handleMouseDown(setControlState, socket)
      );
      element.addEventListener(
        "mouseup",
        handleMouseUp(setControlState, socket)
      );
      element.addEventListener(
        "touchstart",
        handleTouchStart(setControlState, socket)
      );
      element.addEventListener(
        "touchend",
        handleTouchEnd(setControlState, socket)
      );
    });

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown(setControlState, socket)
      );
      document.removeEventListener(
        "keyup",
        handleKeyUp(setControlState, socket)
      );
      Array.from(document.getElementsByClassName("key")).forEach((element) => {
        element.removeEventListener(
          "mousedown",
          handleMouseDown(setControlState, socket)
        );
        element.removeEventListener(
          "mouseup",
          handleMouseUp(setControlState, socket)
        );
        element.removeEventListener(
          "touchstart",
          handleTouchStart(setControlState, socket)
        );
        element.removeEventListener(
          "touchend",
          handleTouchEnd(setControlState, socket)
        );
      });
    };
  };

export const DEFAULT_WHEEL_POWER = {
  p0: 1200, // Forward/Reverse -- all wheel power
  p1: 2000, // Turning -- outside wheel power
  p2: 800, // Turning -- inside wheel power
};

export const validatePower = (
  powerIndex: "p0" | "p1" | "p2",
  power: unknown
): number => {
  let result = Number(power);

  if (Number.isNaN(result)) return DEFAULT_WHEEL_POWER[powerIndex];

  result = Math.abs(result);
  result = Math.round(result);
  result = Math.min(result, MOTOR_DUTY_MAX);
  result = Math.max(result, -1 * MOTOR_DUTY_MAX);

  return result;
};
