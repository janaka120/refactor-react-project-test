import { useEffect } from "react";
import { INACTIVITY_LIMIT } from "../utils/helper";

const useInactivityTimer = (limit = INACTIVITY_LIMIT) => {
  useEffect(() => {
    let timer: number | undefined;
    const reset = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        localStorage.removeItem("isLoggedIn");
        window.dispatchEvent(new Event("login-success"));
      }, limit);
    };
    const events = ["mousemove", "keydown", "mousedown", "touchstart"] as const;
    events.forEach((ev) => window.addEventListener(ev, reset));
    reset();
    return () => {
      if (timer) window.clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [limit]);
};

export default useInactivityTimer;
