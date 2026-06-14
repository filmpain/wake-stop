import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { searchStops } from '@/lib/gtfsData';
import StopCard from '@/components/StopCard';
import ArmConfirmSheet from '@/components/ArmConfirmSheet';

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [pendingStop, setPendingStop] = useState(null);
  const [busyIds, setBusyIds] = useState(() => new Set());

  useEffect(() => {
    base44.entities.FavoriteStop.list('sort_order', 100).then(setFavorites);
  }, []);

  // Reset to initial state when the Search tab is re-tapped in the bottom nav.
  useEffect(() => {
    const onReset = (e) => {
      if (e.detail === '/search') setQuery('');
    };
    window.addEventListener('tab-reset', onReset);
    return () => window.removeEventListener('tab-reset', onReset);
  }, []);

  const results = useMemo(() => searchStops(query, 40), [query]);
  const favIds = useMemo(() => new Set(favorites.map(f => f.stop_id)), [favorites]);

  const toggleFavorite = async (stop) => {
    if (busyIds.has(stop.stop_id)) return;
    setBusyIds(prev => new Set(prev).add(stop.stop_id));
    try {
      const existing = favorites.find(f => f.stop_id === stop.stop_id);
      if (existing) {
        await base44.entities.FavoriteStop.delete(existing.id);
        setFavorites(prev => prev.filter(f => f.id !== existing.id));
      } else {
        const created = await base44.entities.FavoriteStop.create({
          stop_id: stop.stop_id,
          stop_name: stop.stop_name,
          stop_type: stop.stop_type,
          routes: stop.routes,
          stop_lat: stop.stop_lat,
          stop_lon: stop.stop_lon,
          sort_order: favorites.length,
        });
        setFavorites(prev => [...prev, created]);
      }
    } finally {
      setBusyIds(prev => {
        const next = new Set(prev);
        next.delete(stop.stop_id);
        return next;
      });
    }
  };

  const handleTap = (stop) => {
    navigate(`/stop/${stop.stop_type}/${encodeURIComponent(stop.stop_id)}`);
  };

  const handleArm = (stop) => {
    // Only arm when the user explicitly taps the Alarm button.
    setPendingStop(stop);
  };

  const handleConfirmArm = () => {
    const stop = pendingStop;
    setPendingStop(null);
    navigate(`/ride/${encodeURIComponent(stop.stop_id)}`);
  };

  return (
    <div className="px-5 pt-[env(safe-area-inset-top)] pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 pt-4 pb-4">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Find a stop</h1>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Stop name, line, or bus route…"
          className="w-full h-14 bg-secondary rounded-2xl pl-12 pr-12 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-background flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Helper chips */}
      {!query && (
        <div className="mt-4 flex flex-wrap gap-2">
          {['86 St','Union Sq','Bedford','M15','Q','L'].map(q => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              className="px-3 h-8 rounded-full bg-secondary text-sm font-medium hover:bg-secondary/80"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="mt-6 space-y-2">
        {query && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No stops match "{query}"
          </div>
        )}
        {results.map(stop => (
          <StopCard
            key={`${stop.stop_type}-${stop.stop_id}`}
            stop={stop}
            onTap={handleTap}
            onArm={handleArm}
            onToggleFavorite={toggleFavorite}
            isFavorite={favIds.has(stop.stop_id)}
            action="favorite"
          />
        ))}
      </div>

      <ArmConfirmSheet
        stop={pendingStop}
        open={!!pendingStop}
        onClose={() => setPendingStop(null)}
        onConfirm={handleConfirmArm}
      />
    </div>
  );
}