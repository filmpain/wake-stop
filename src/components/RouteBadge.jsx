import React from 'react';

// Approximate NYC subway line colors. Bus routes get a generic blue.
const SUBWAY_COLORS = {
  '1': '#EE352E', '2': '#EE352E', '3': '#EE352E',
  '4': '#00933C', '5': '#00933C', '6': '#00933C',
  '7': '#B933AD',
  'A': '#2850AD', 'C': '#2850AD', 'E': '#2850AD',
  'B': '#FF6319', 'D': '#FF6319', 'F': '#FF6319', 'M': '#FF6319',
  'G': '#6CBE45',
  'J': '#996633', 'Z': '#996633',
  'L': '#A7A9AC',
  'N': '#FCCC0A', 'Q': '#FCCC0A', 'R': '#FCCC0A', 'W': '#FCCC0A',
  'S': '#808183',
};

export default function RouteBadge({ route, size = 'md' }) {
  const isSubway = SUBWAY_COLORS[route] !== undefined;
  const baseRoute = route?.replace('-SBS', '');
  const color = SUBWAY_COLORS[baseRoute] || '#1E40AF';
  const isYellow = ['N','Q','R','W'].includes(baseRoute);
  const textColor = isYellow ? '#000' : '#fff';

  const sizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-9 h-9 text-sm',
  };

  if (isSubway) {
    return (
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-bold shrink-0`}
        style={{ background: color, color: textColor }}
      >
        {baseRoute}
      </div>
    );
  }

  // Bus route — pill shape with route code
  return (
    <div
      className={`px-2 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0`}
      style={{ background: color, color: '#fff' }}
    >
      {route}
    </div>
  );
}