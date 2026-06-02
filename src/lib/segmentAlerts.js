import { findStopById } from '@/lib/gtfsData';

// Keep only alerts whose affected stops fall inside the geographic bounding box
// spanning the rider's current GPS position and their destination — i.e. the
// segment they're actually riding. Alerts with no resolvable stop coordinates
// fall back to being shown (route-level alerts).
export function filterAlertsToSegment(alerts, position, destination) {
  if (!alerts || alerts.length === 0) return [];
  if (!position || !destination) return alerts;

  const pad = 0.005; // ~500m padding so edge stops aren't dropped
  const minLat = Math.min(position.lat, destination.stop_lat) - pad;
  const maxLat = Math.max(position.lat, destination.stop_lat) + pad;
  const minLon = Math.min(position.lon, destination.stop_lon) - pad;
  const maxLon = Math.max(position.lon, destination.stop_lon) + pad;

  const inBox = (lat, lon) =>
    lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;

  return alerts.filter((alert) => {
    const stops = (alert.stop_ids || [])
      .map((id) => findStopById(id))
      .filter(Boolean);

    // No known stop coords → can't segment-filter, keep it (route-level alert).
    if (stops.length === 0) return true;

    // Keep only if at least one affected stop is within the ride segment.
    return stops.some((s) => inBox(s.stop_lat, s.stop_lon));
  });
}