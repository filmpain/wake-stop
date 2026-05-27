import { useEffect, useState, useRef } from 'react';

// Hook that watches user location via GPS. Falls back gracefully if permission denied.
// On NYC subways, GPS is unreliable underground — we surface the timestamp so the
// UI can show "last known" and the position continues to update at ground level.
export function useLocation(enabled = true) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState('unknown');
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('Geolocation not supported on this device');
      return;
    }

    const onSuccess = (pos) => {
      setPosition({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      });
      setPermissionState('granted');
      setError(null);
    };

    const onError = (err) => {
      if (err.code === 1) setPermissionState('denied');
      setError(err.message);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000,
    });

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled]);

  return { position, error, permissionState };
}