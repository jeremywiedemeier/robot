const MOTOR_DUTY_MAX = 4095;

export const DEFAULT_WHEEL_POWER = {
  p0: 800, // Forward/Reverse -- all wheel power
  p1: 2000, // Turning -- outside wheel power
  p2: 800, // Turning -- inside wheel power
};

export const TIME_DELTA = 200; // milliseconds
export const MIN_DIST = 40; // centimeters

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
  controlMode: "manual" | "random";
  random: {
    stage: "travelling" | "turning";
  };
}

export const DEFAULT_CONTROL_STATE: ControlState = {
  activeKeys: [],
  wheelPower: DEFAULT_WHEEL_POWER,
  servo: { x: 90 },
  controlMode: "manual",
  random: {
    stage: "travelling",
  },
};

// Controls sent to the server every time controlState changes
export interface Input {
  motor: { fl: number; fr: number; bl: number; br: number };
  servo: { x: number };
  buzzer: { active: boolean };
  ultrasound: { active: boolean };
  control_mode: string;
}

export const controlStateToInput = (controlState: ControlState): Input => {
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

  const servo: Input["servo"] = {
    x: controlState.servo.x,
  };

  const buzzer: Input["buzzer"] = {
    active: controlState.activeKeys.includes("c"),
  };

  const ultrasound: Input["ultrasound"] = {
    active: controlState.activeKeys.includes("z"),
  };

  const { controlMode } = controlState;

  return { motor, servo, buzzer, ultrasound, control_mode: controlMode };
};

const handleKeyDown =
  (setControlState: React.Dispatch<React.SetStateAction<ControlState>>) =>
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

        // For controlMode, if any keys are pressed, switch to "manual"
        newControlState.controlMode = "manual";

        return newControlState;
      });
  };

const handleKeyUp =
  (setControlState: React.Dispatch<React.SetStateAction<ControlState>>) =>
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

        return newControlState;
      });
  };

const handleMouseDown =
  (setControlState: React.Dispatch<React.SetStateAction<ControlState>>) =>
  (evt: Event) => {
    handleKeyDown(setControlState)(evt);
  };

const handleMouseUp =
  (setControlState: React.Dispatch<React.SetStateAction<ControlState>>) =>
  (evt: Event) => {
    handleKeyUp(setControlState)(evt);
  };

const handleTouchStart =
  (setControlState: React.Dispatch<React.SetStateAction<ControlState>>) =>
  (evt: Event) => {
    evt.preventDefault();

    handleKeyDown(setControlState)(evt);
  };
const handleTouchEnd = handleMouseUp;

export const addEventListeners =
  (setControlState: React.Dispatch<React.SetStateAction<ControlState>>) =>
  (): (() => void) => {
    document.addEventListener("keydown", handleKeyDown(setControlState));
    document.addEventListener("keyup", handleKeyUp(setControlState));

    Array.from(document.getElementsByClassName("key")).forEach((element) => {
      element.addEventListener("mousedown", handleMouseDown(setControlState));
      element.addEventListener("mouseup", handleMouseUp(setControlState));
      element.addEventListener("touchstart", handleTouchStart(setControlState));
      element.addEventListener("touchend", handleTouchEnd(setControlState));
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown(setControlState));
      document.removeEventListener("keyup", handleKeyUp(setControlState));
      Array.from(document.getElementsByClassName("key")).forEach((element) => {
        element.removeEventListener(
          "mousedown",
          handleMouseDown(setControlState)
        );
        element.removeEventListener("mouseup", handleMouseUp(setControlState));
        element.removeEventListener(
          "touchstart",
          handleTouchStart(setControlState)
        );
        element.removeEventListener(
          "touchend",
          handleTouchEnd(setControlState)
        );
      });
    };
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
