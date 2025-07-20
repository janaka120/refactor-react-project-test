import React from "react";

const UserIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      cx="10"
      cy="7"
      r="4"
      stroke="#555"
      strokeWidth="1.5"
      fill="#e0e0e0"
    />
    <path
      d="M3 17c0-2.5 3-4 7-4s7 1.5 7 4"
      stroke="#555"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export default UserIcon;
