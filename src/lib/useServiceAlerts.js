import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

// Fetches active MTA service alerts for the given routes.
// Returns { alerts, loading }. Re-fetches when routes change.
export function useServiceAlerts(routes) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Stable key so the effect only re-runs when the route list actually changes.
  const routeKey = (routes || []).join(',');

  useEffect(() => {
    let cancelled = false;
    if (!routeKey) {
      setAlerts([]);
      return;
    }
    setLoading(true);
    base44.functions
      .invoke('serviceAlerts', { routes: routeKey.split(',') })
      .then((res) => {
        if (!cancelled) setAlerts(res.data?.alerts || []);
      })
      .catch(() => {
        if (!cancelled) setAlerts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [routeKey]);

  return { alerts, loading };
}