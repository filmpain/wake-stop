import React from 'react';

const LOGO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_30eZ1PXUqu5oPa0Rp1UXNZrN0ah/hf_20260527_042941_95796515-1dd5-4d2e-b95a-6fac80ee2ffa.png';

export default function WakeStopLogo({ size = 40, className = '' }) {
  return (
    <img
      src={LOGO_URL}
      alt="Wake Stop"
      width={size}
      height={size}
      className={`rounded-xl ${className}`}
      style={{ width: size, height: size }}
    />
  );
}