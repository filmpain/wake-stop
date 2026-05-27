import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Tiny inline SVG markers — no external icon assets needed
const userIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:hsl(217 91% 60%);border:3px solid white;
    box-shadow:0 0 0 6px hsla(217,91%,60%,0.25), 0 0 12px hsla(217,91%,60%,0.6);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const destIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:22px;height:22px;border-radius:50%;
    background:hsl(38 95% 55%);border:3px solid white;
    box-shadow:0 0 0 6px hsla(38,95%,55%,0.25);
    display:flex;align-items:center;justify-content:center;
    color:black;font-weight:900;font-size:11px;
  ">★</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export default function RideMap({ userLat, userLon, destLat, destLon, className = '' }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      center: [destLat, destLon],
      zoom: 14,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
    destMarkerRef.current = L.marker([destLat, destLon], { icon: destIcon }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [destLat, destLon]);

  // Update user marker + fit bounds when user position changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (userLat == null || userLon == null) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLat, userLon]);
    } else {
      userMarkerRef.current = L.marker([userLat, userLon], { icon: userIcon }).addTo(map);
    }

    if (lineRef.current) map.removeLayer(lineRef.current);
    lineRef.current = L.polyline([[userLat, userLon], [destLat, destLon]], {
      color: 'hsl(217 91% 60%)',
      weight: 4,
      opacity: 0.7,
      dashArray: '8 8',
    }).addTo(map);

    const bounds = L.latLngBounds([[userLat, userLon], [destLat, destLon]]);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
  }, [userLat, userLon, destLat, destLon]);

  return <div ref={containerRef} className={className} style={{ minHeight: 240 }} />;
}