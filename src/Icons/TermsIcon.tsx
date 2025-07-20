import React from "react";

const TermsIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" role="img">
    <rect x="3" y="3" width="16" height="16" rx="4" fill="#7c5fe6" />
    <rect x="6" y="7" width="10" height="2" rx="1" fill="#fff" />
    <rect x="6" y="11" width="6" height="2" rx="1" fill="#fff" />
  </svg>
);

export default TermsIcon;
