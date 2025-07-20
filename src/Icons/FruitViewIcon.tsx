import React from "react";

const FruitViewIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" role="img">
    <circle
      cx="11"
      cy="11"
      r="9"
      stroke="#FFD600"
      strokeWidth="2"
      fill="#FFF9C4"
    />
    <ellipse
      cx="11"
      cy="11"
      rx="5"
      ry="7"
      fill="#FFEB3B"
      stroke="#FBC02D"
      strokeWidth="1.5"
    />
    <circle cx="11" cy="11" r="2" fill="#F57C00" />
    <path
      d="M11 4 L13 2"
      stroke="#388E3C"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11 4 L9 2"
      stroke="#388E3C"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default FruitViewIcon;
