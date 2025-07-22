import React, { useState, useEffect } from "react";
import LoginComponent from "./components/LoginComponent";
import { isLoggedIn, logoutIfInactive } from "./utils/authUtils";
import App from "./App";

const Root: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    logoutIfInactive();
  }, []);

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    window.dispatchEvent(new Event("login-success"));
    forceUpdate();
  };

  useEffect(() => {
    const handler = () => setLoggedIn(isLoggedIn());
    window.addEventListener("login-success", handler);
    return () => window.removeEventListener("login-success", handler);
  }, []);

  if (!loggedIn) {
    return <LoginComponent onLoginSuccess={handleLoginSuccess} />;
  }
  return <App />;
};

export default Root;
