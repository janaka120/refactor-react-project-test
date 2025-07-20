// utils/authUtils.ts
export const isLoggedIn = () => !!localStorage.getItem("isLoggedIn");

export const logoutIfInactive = () => {
  let timeout: NodeJS.Timeout;
  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      localStorage.removeItem("isLoggedIn");
      window.location.reload();
    }, 1000 * 60 * 10); // 10 minutes
  };
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;
};
