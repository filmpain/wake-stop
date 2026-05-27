import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, Moon, Sun, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useTheme } from '@/lib/ThemeContext';
import WakeStopLogo from '@/components/WakeStopLogo';
import StopCard from '@/components/StopCard';

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    const rows = await base44.entities.FavoriteStop.list('sort_order', 50);
    setFavorites(rows);
    setLoading(false);
  };

  useEffect(() => { loadFavorites(); }, []);

  const handleTap = (stop) => {
    navigate(`/ride/${encodeURIComponent(stop.stop_id)}`);
  };

  return (
    <div className="px-5 pt-[env(safe-area-inset-top)] pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-6">
        <div className="flex items-center gap-3">
          <WakeStopLogo size={44} />
          <div>
            <div className="text-xl font-extrabold tracking-tight leading-none">Wake Stop</div>
            <div className="text-xs text-muted-foreground mt-1">Never miss your stop</div>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Quick search bar */}
      <button
        onClick={() => navigate('/search')}
        className="w-full flex items-center gap-3 bg-secondary hover:bg-secondary/80 rounded-2xl px-4 h-14 text-left transition-colors"
      >
        <Search className="w-5 h-5 text-muted-foreground" />
        <span className="text-muted-foreground">Search stops, routes…</span>
      </button>

      {/* Favorites */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Favorites</h2>
          <span className="text-xs text-muted-foreground">{favorites.length}</span>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-20 bg-secondary/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <EmptyFavorites onSearch={() => navigate('/search')} />
        ) : (
          <div className="space-y-2">
            {favorites.map((fav, i) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <StopCard stop={fav} onTap={handleTap} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Tip */}
      {favorites.length > 0 && (
        <div className="mt-8 bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div className="text-sm">
            <div className="font-semibold mb-0.5">One tap to arm</div>
            <div className="text-muted-foreground">Tap any favorite to start monitoring. Doze off — we'll wake you up.</div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyFavorites({ onSearch }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
        <Plus className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="font-bold text-base mb-1">No favorites yet</h3>
      <p className="text-sm text-muted-foreground mb-5">
        Search for your home, work, or that bar stop. Star them — they'll show up here for one-tap arming.
      </p>
      <button
        onClick={onSearch}
        className="bg-primary text-primary-foreground font-semibold rounded-full h-11 px-6 inline-flex items-center gap-2"
      >
        <Search className="w-4 h-4" />
        Find a stop
      </button>
    </div>
  );
}