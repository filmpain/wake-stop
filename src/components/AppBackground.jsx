import React from 'react';
import { useTheme } from '@/lib/ThemeContext';

const DARK_BG = 'https://media.base44.com/images/public/6a1671fb50d588b068e1ab55/87395bfc4_darkthemebg.png';
const LIGHT_BG = 'https://media.base44.com/images/public/6a1671fb50d588b068e1ab55/9b52ebc35_lightthemebg.png';

// Fixed full-screen NYC transit-map backdrop that swaps with the theme.
// Sits behind all content; kept subtle so text stays readable.
export default function AppBackground() {
  const { theme } = useTheme();
  const src = theme === 'dark' ? DARK_BG : LIGHT_BG;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        style={{ opacity: theme === 'dark' ? 0.35 : 0.5 }}
      />
      {/* Gradient veil to keep foreground content legible */}
      <div className="absolute inset-0 bg-background/70" />
    </div>
  );
}