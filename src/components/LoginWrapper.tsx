// LoginWrapper.tsx
import React, { useEffect } from "react";
import { isLoggedIn, logoutIfInactive } from "../utils/authUtils";
import LoginComponent from "./LoginComponent";

export const LoginWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    logoutIfInactive();
  }, []);

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    window.dispatchEvent(new Event("login-success"));
    forceUpdate();
  };

  if (!isLoggedIn()) {
    return <LoginComponent onLoginSuccess={handleLoginSuccess} />;
  }

  return <>{children}</>;
};
