import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, AlertTriangle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { findStopById } from '@/lib/gtfsData';
import { useGeoLocation } from '@/lib/useGeoLocation';
import { useSettings } from '@/lib/useSettings';
import { useWakeLock } from '@/lib/useWakeLock';
import { haversineMeters, metersToStops, formatDistance } from '@/lib/distance';
import { triggerAlert, unlockAudio } from '@/lib/alerts';
import RideMap from '@/components/RideMap';
import RouteBadge from '@/components/RouteBadge';
import WakeAlert from '@/components/WakeAlert';
import ServiceAlertBanner from '@/components/ServiceAlertBanner';
import { useServiceAlerts } from '@/lib/useServiceAlerts';
import { filterAlertsToSegment } from '@/lib/segmentAlerts';

export default function RidePage() {
  const { stopId } = useParams();
  const navigate = useNavigate();
  const decodedId = decodeURIComponent(stopId || '');
  const [favStop, setFavStop] = useState(null);

  // Resolve stop from GTFS or favorites
  useEffect(() => {
    (async () => {
      const gtfs = findStopById(decodedId);
      if (gtfs) { setFavStop({ ...gtfs, stop_type: gtfs.stop_type || (decodedId.startsWith('MTA_') ? 'bus' : 'subway') }); return; }
      const favs = await base44.entities.FavoriteStop.filter({ stop_id: decodedId });
      if (favs.length > 0) setFavStop(favs[0]);
    })();
  }, [decodedId]);

  const { settings, loaded } = useSettings();
  const { position, error: locError, permissionState } = useGeoLocation(true);
  const { alerts: rawAlerts } = useServiceAlerts(favStop?.routes);

  // Only surface alerts affecting the segment between the rider's GPS and destination.
  const serviceAlerts = useMemo(
    () => filterAlertsToSegment(rawAlerts, position, favStop),
    [rawAlerts, position, favStop]
  );
  const [alertTriggered, setAlertTriggered] = useState(false);
  const sessionIdRef = useRef(null);
  const alertFiredRef = useRef(false);

  // Keep the screen awake during the ride so GPS keeps updating.
  useWakeLock(!!favStop && !alertTriggered);

  // Unlock the audio context while we still have the arming gesture, so the
  // GPS-triggered alert can actually play sound on mobile.
  useEffect(() => {
    unlockAudio();
  }, []);

  // Create/reuse RideSession on mount. Reuses an active session for the same
  // stop if one exists, and cancels any other stale active sessions to keep
  // the "armed" state consistent.
  useEffect(() => {
    if (!favStop || sessionIdRef.current) return;
    let isMounted = true;
    (async () => {
      try {
        const active = await base44.entities.RideSession.filter({ status: 'active' });
        const matching = active.find((s) => s.destination_stop_id === favStop.stop_id);
        
        // Cancel any other stale active sessions
        await Promise.all(
          active
            .filter((s) => s.id !== matching?.id)
            .map((s) => base44.entities.RideSession.update(s.id, {
              status: 'cancelled',
              ended_at: new Date().toISOString(),
            }))
        );
        
        if (!isMounted) return;

        if (matching) {
          sessionIdRef.current = matching.id;
          return;
        }
        
        const created = await base44.entities.RideSession.create({
          destination_stop_id: favStop.stop_id,
          destination_stop_name: favStop.stop_name,
          destination_stop_type: favStop.stop_type,
          destination_lat: favStop.stop_lat,
          destination_lon: favStop.stop_lon,
          route_id: (favStop.routes || [])[0] || '',
          started_at: new Date().toISOString(),
          status: 'active',
        });
        
        if (isMounted) sessionIdRef.current = created.id;
      } catch (err) {
        console.error("Failed to arm session:", err);
      }
    })();
    return () => { isMounted = false; };
  }, [favStop]);

  // Distance + stops away
  const distanceMeters = useMemo(() => {
    if (!position || !favStop) return null;
    return haversineMeters(position.lat, position.lon, favStop.stop_lat, favStop.stop_lon);
  }, [position, favStop]);

  const stopsAway = useMemo(() => {
    if (distanceMeters == null) return null;
    return metersToStops(distanceMeters);
  }, [distanceMeters]);

  // Check if we should fire alert
  useEffect(() => {
    if (!loaded || alertFiredRef.current) return;
    if (stopsAway == null) return;
    if (stopsAway <= settings.stops_advance_warning) {
      alertFiredRef.current = true;
      setAlertTriggered(true);
      triggerAlert(settings);
      if (sessionIdRef.current) {
        base44.entities.RideSession.update(sessionIdRef.current, {
          status: 'alerted',
          alert_triggered_at: new Date().toISOString(),
        });
      }
    }
  }, [stopsAway, settings, loaded]);

  // Cancel session — cancel ALL active sessions to clear any orphans too
  const handleCancel = async () => {
    const active = await base44.entities.RideSession.filter({ status: 'active' });
    await Promise.all(
      active.map((s) => base44.entities.RideSession.update(s.id, {
        status: 'cancelled',
        ended_at: new Date().toISOString(),
      }))
    );
    sessionIdRef.current = null;
    navigate('/');
  };

  const handleDismissAlert = async () => {
    setAlertTriggered(false);
    if (sessionIdRef.current) {
      await base44.entities.RideSession.update(sessionIdRef.current, {
        status: 'completed',
        ended_at: new Date().toISOString(),
      });
    }
    navigate('/');
  };

  if (!favStop) {
    return <div className="p-8 text-center text-muted-foreground">Loading stop…</div>;
  }

  if (alertTriggered) {
    return (
      <WakeAlert
        stopName={favStop.stop_name}
        routes={favStop.routes}
        settings={settings}
        onDismiss={handleDismissAlert}
      />
    );
  }

  return (
    <div className="px-5 pt-[env(safe-area-inset-top)] pb-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between pt-4 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 armed-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-green-500">Armed</span>
        </div>
      </div>

      {/* Destination */}
      <div className="bg-card border border-border rounded-3xl p-5 mb-4">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Wake me at</div>
        <div className="text-2xl font-extrabold leading-tight">{favStop.stop_name}</div>
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {(favStop.routes || []).map(r => <RouteBadge key={r} route={r} size="sm" />)}
        </div>
      </div>

      {/* Service alerts for this route */}
      <ServiceAlertBanner alerts={serviceAlerts} />

      {/* Big countdown */}
      <Countdown
        stopsAway={stopsAway}
        distanceMeters={distanceMeters}
        warning={settings.stops_advance_warning}
        hasFix={!!position}
        permissionState={permissionState}
        locError={locError}
      />

      {/* Map */}
      <div className="mt-4 rounded-3xl overflow-hidden border border-border" style={{ height: 260 }}>
        <RideMap
          userLat={position?.lat}
          userLon={position?.lon}
          destLat={favStop.stop_lat}
          destLon={favStop.stop_lon}
          className="w-full h-full"
        />
      </div>

      {/* Cancel */}
      <button
        onClick={handleCancel}
        className="w-full mt-5 h-14 rounded-2xl border-2 border-destructive/40 text-destructive font-bold flex items-center justify-center gap-2 hover:bg-destructive/10"
      >
        <X className="w-5 h-5" />
        Cancel alarm
      </button>

      <p className="mt-4 text-xs text-muted-foreground text-center px-4">
        Keep this screen open. We use GPS + transit data to detect your stop, even with weak underground signal.
      </p>
    </div>
  );
}

function Countdown({ stopsAway, distanceMeters, warning, hasFix, permissionState, locError }) {
  if (permissionState === 'denied') {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-3xl p-5 flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-destructive">Location permission denied</div>
          <div className="text-sm text-muted-foreground mt-1">Enable location in your browser/device settings to monitor your stop.</div>
        </div>
      </div>
    );
  }

  if (!hasFix) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 text-center">
        <Navigation className="w-7 h-7 mx-auto text-primary animate-pulse" />
        <div className="mt-2 font-bold">Acquiring location…</div>
        <div className="text-xs text-muted-foreground mt-1">{locError || 'Waiting for GPS / WiFi signal'}</div>
      </div>
    );
  }

  return (
    <motion.div
      key={stopsAway}
      initial={{ scale: 0.96, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-card border border-border rounded-3xl p-6 text-center"
    >
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stops away</div>
      <div className="my-2 flex items-center justify-center gap-3">
        <div className="text-7xl font-black tabular-nums leading-none">{stopsAway}</div>
      </div>
      <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>{formatDistance(distanceMeters)}</span>
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${Math.max(0, Math.min(100, 100 - (stopsAway / 10) * 100))}%` }}
        />
      </div>
      <div className="text-[11px] text-muted-foreground mt-2">
        Alert fires at {warning} stop{warning>1?'s':''} away
      </div>
    </motion.div>
  );
}