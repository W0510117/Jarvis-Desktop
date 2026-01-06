import { useEffect, useState } from "react";

export default function useJarvisStream() {
  const [state, setState] = useState("idle");

  useEffect(() => {
    window.electron.receive("jarvis-event", (data) => {
      if (data.event === "thinking") {
        setState(data.stage); 
      }
    });
  }, []);

  return state;
}
