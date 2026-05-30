import { useEffect, useRef } from 'react';

// Keeps the screen awake while `enabled` is true (so GPS keeps updating during a ride).
// Re-acquires the lock automatically when the tab becomes visible again.
export function useWakeLock(enabled = true) {
  const lockRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;

    let released = false;

    const request = async () => {
      try {
        lockRef.current = await navigator.wakeLock.request('screen');
      } catch (e) {
        // Permission/visibility issues — non-fatal.
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !released) request();
    };

    request();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      released = true;
      document.removeEventListener('visibilitychange', onVisibility);
      if (lockRef.current) {
        lockRef.current.release().catch(() => {});
        lockRef.current = null;
      }
    };
  }, [enabled]);
}