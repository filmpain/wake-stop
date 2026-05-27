// Haversine distance in meters between two lat/lon points
export function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // earth radius in meters
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Approximate "stops away" using meters between user and destination.
// NYC stops are roughly 400-800m apart. We treat ~500m as one stop.
export function metersToStops(meters) {
  return Math.max(0, Math.round(meters / 500));
}

// Format meters into a friendly distance label
export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}