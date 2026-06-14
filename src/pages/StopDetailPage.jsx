import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Train, Bus, Star, Clock, Navigation, Bell, Route, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { findStopById } from '@/lib/gtfsData';
import RouteBadge from '@/components/RouteBadge';
import ArmConfirmSheet from '@/components/ArmConfirmSheet';

export default function StopDetailPage() {
  const { stopType, stopId } = useParams();
  const navigate = useNavigate();
  const decodedId = decodeURIComponent(stopId || '');

  const stop = findStopById(decodedId);
  const [arrivals, setArrivals] = useState(null);
  const [arrivalsLoading, setArrivalsLoading] = useState(false);
  const [arrivalsError, setArrivalsError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favBusy, setFavBusy] = useState(false);
  const [pendingStop, setPendingStop] = useState(null);

  useEffect(() => {
    base44.entities.FavoriteStop.list('sort_order', 100).then(setFavorites);
  }, []);

  const isFavorite = favorites.some((f) => f.stop_id === decodedId);

  const loadArrivals = useCallback(async () => {
    if (!stop || stop.stop_type !== 'bus') return;
    setArrivalsLoading(true);
    setArrivalsError(null);
    try {
      const res = await base44.functions.invoke('busArrivals', { stop_id: decodedId });
      setArrivals(res.data.arrivals || []);
    } catch (err) {
      setArrivalsError('Could not load arrivals');
    } finally {
      setArrivalsLoading(false);
    }
  }, [stop, decodedId]);

  useEffect(() => {
    loadArrivals();
    // Refresh every 30s while on the page
    const interval = setInterval(loadArrivals, 30000);
    return () => clearInterval(interval);
  }, [loadArrivals]);

  const handleToggleFavorite = async () => {
    if (favBusy || !stop) return;
    setFavBusy(true);
    try {
      const existing = favorites.find((f) => f.stop_id === decodedId);
      if (existing) {
        await base44.entities.FavoriteStop.delete(existing.id);
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
      } else {
        const created = await base44.entities.FavoriteStop.create({
          stop_id: stop.stop_id,
          stop_name: stop.stop_name,
          stop_type: stop.stop_type,
          routes: stop.routes || [],
          stop_lat: stop.stop_lat,
          stop_lon: stop.stop_lon,
          sort_order: favorites.length,
        });
        setFavorites((prev) => [...prev, created]);
      }
    } finally {
      setFavBusy(false);
    }
  };

  if (!stop) {
    return (
      <div className="px-5 pt-[env(safe-area-inset-top)] pb-6">
        <div className="flex items-center gap-3 pt-4 pb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Stop not found</h1>
        </div>
        <p className="text-muted-foreground text-center py-12">This stop isn't in our database.</p>
      </div>
    );
  }

  const Icon = stop.stop_type === 'subway' ? Train : Bus;

  const formatArrivalTime = (t) => {
    if (!t) return '--';
    const eta = new Date(t);
    const now = new Date();
    const diffMin = Math.max(0, Math.round((eta - now) / 60000));
    if (diffMin === 0) return 'Due';
    return `${diffMin} min`;
  };

  const formatClock = (t) => {
    if (!t) return '--';
    const eta = new Date(t);
    return eta.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="px-5 pt-[env(safe-area-inset-top)] pb-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between pt-4 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleToggleFavorite}
          disabled={favBusy}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={`w-5 h-5 ${isFavorite ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
        </button>
      </div>

      {/* Stop info */}
      <div className="bg-card border border-border rounded-3xl p-5 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              {stop.stop_type === 'subway' ? 'Subway Station' : 'Bus Stop'}
            </div>
            <div className="text-xl font-extrabold leading-tight">{stop.stop_name}</div>
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              {(stop.routes || []).map((r) => (
                <RouteBadge key={r} route={r} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Arrivals — bus only */}
      {stop.stop_type === 'bus' && (
        <div className="bg-card border border-border rounded-3xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Real-Time Arrivals</h2>
            <button
              onClick={loadArrivals}
              disabled={arrivalsLoading}
              className="ml-auto w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
              aria-label="Refresh arrivals"
            >
              <Loader2 className={`w-4 h-4 ${arrivalsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {arrivalsLoading && !arrivals && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-secondary/60 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {arrivalsError && (
            <div className="text-center py-6 text-sm text-destructive">{arrivalsError}</div>
          )}

          {arrivals && arrivals.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">No buses currently scheduled</div>
          )}

          {arrivals && arrivals.length > 0 && (
            <div className="space-y-2">
              {arrivals.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-secondary/60 rounded-xl px-4 py-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-extrabold text-primary">{a.route}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">toward {a.destination || '—'}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Navigation className="w-3 h-3" />
                      {a.stops_away != null ? `${a.stops_away} stop${a.stops_away !== 1 ? 's' : ''} away` : 'En route'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-extrabold tabular-nums leading-none">{formatArrivalTime(a.expected_arrival)}</div>
                    <div className="text-[11px] text-muted-foreground">{formatClock(a.expected_arrival)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subway: no real-time API, just a note */}
      {stop.stop_type === 'subway' && (
        <div className="bg-card border border-border rounded-3xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Arrivals</h2>
          </div>
          <div className="bg-secondary/60 rounded-xl p-4 flex items-start gap-3">
            <Route className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold">Real-time subway arrivals unavailable</div>
              <div className="text-xs text-muted-foreground mt-1">
                The MTA doesn't provide a public real-time API for subway arrivals. Tap <strong>Arm Alarm</strong> below and we'll track your ride using GPS.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Arm button */}
      <button
        onClick={() => setPendingStop(stop)}
        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        <Bell className="w-5 h-5" />
        Arm alarm for this stop
      </button>

      <ArmConfirmSheet
        stop={pendingStop}
        open={!!pendingStop}
        onClose={() => setPendingStop(null)}
        onConfirm={() => {
          const s = pendingStop;
          setPendingStop(null);
          navigate(`/ride/${encodeURIComponent(s.stop_id)}`);
        }}
      />
    </div>
  );
}