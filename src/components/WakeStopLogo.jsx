import React from 'react';

const LOGO_URL = 'https://media.base44.com/images/public/6a1671fb50d588b068e1ab55/15263a1b1_wakestop.png';

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