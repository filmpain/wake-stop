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
    const stopIds = alert.stop_ids || [];

    // Truly route-level alert (no specific stops) → keep, it affects the whole line.
    if (stopIds.length === 0) return true;

    const stops = stopIds.map((id) => findStopById(id)).filter(Boolean);

    // Alert targets specific stops but none resolve to coordinates → we can't
    // confirm it's on this segment, so drop it to avoid noise.
    if (stops.length === 0) return false;

    // Keep only if at least one affected stop is within the ride segment.
    return stops.some((s) => inBox(s.stop_lat, s.stop_lon));
  });
}