import React, { useRef, useState } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';

const THRESHOLD = 70;
const MAX_PULL = 110;

export default function PullToRefresh({ onRefresh, children }) {
  const startY = useRef(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onTouchStart = (e) => {
    if (refreshing) return;
    // Only start tracking when scrolled to top
    if (window.scrollY > 0) return;
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (startY.current == null || refreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) {
      setPull(0);
      return;
    }
    // Damp the drag for a rubbery feel
    const damped = Math.min(MAX_PULL, dy * 0.5);
    setPull(damped);
  };

  const onTouchEnd = async () => {
    if (startY.current == null) return;
    startY.current = null;
    if (pull >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      try { await onRefresh?.(); } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  };

  const indicatorOpacity = Math.min(1, pull / THRESHOLD);
  const showIndicator = refreshing || pull > 0;

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ transform: `translateY(${refreshing ? 40 : pull}px)`, transition: startY.current ? 'none' : 'transform 0.25s ease' }}
    >
      {showIndicator && (
        <div
          className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
          style={{ top: -44, opacity: indicatorOpacity }}
        >
          <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg">
            {refreshing ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <ArrowDown
                className="w-5 h-5 text-primary transition-transform"
                style={{ transform: `rotate(${pull >= THRESHOLD ? 180 : 0}deg)` }}
              />
            )}
          </div>
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}