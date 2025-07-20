import React from "react";

const AboutIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" role="img">
    <rect x="3" y="3" width="16" height="16" rx="4" fill="#7c5fe6" />
    <rect x="10" y="7" width="2" height="2" rx="1" fill="#fff" />
    <rect x="10" y="10" width="2" height="5" rx="1" fill="#fff" />
  </svg>
);

export default AboutIcon;
