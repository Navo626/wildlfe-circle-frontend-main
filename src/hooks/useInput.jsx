import { useEffect, useState } from "react";

const useInput = () => {
  const [input, setInput] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
    jump: false,
  });

  useEffect(() => {
    const keys = {
      KeyW: "forward",
      KeyS: "backward",
      KeyA: "left",
      KeyD: "right",
      ShiftLeft: "shift",
      ShiftRight: "shift",
      Space: "jump",
      ArrowUp: "forward",
      ArrowDown: "backward",
      ArrowLeft: "left",
      ArrowRight: "right",
    };

    const handleKeyDown = (e) => {
      if (keys[e.code]) {
        setInput((m) => ({ ...m, [keys[e.code]]: true }));
      }
    };

    const handleKeyUp = (e) => {
      if (keys[e.code]) {
        setInput((m) => ({ ...m, [keys[e.code]]: false }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return input;
};

export default useInput;
