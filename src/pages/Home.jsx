import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, Moon, Sun, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useTheme } from '@/lib/ThemeContext';
import WakeStopLogo from '@/components/WakeStopLogo';
import StopCard from '@/components/StopCard';
import ArmedBanner from '@/components/ArmedBanner';
import ArmConfirmSheet from '@/components/ArmConfirmSheet';
import PullToRefresh from '@/components/PullToRefresh';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [pendingStop, setPendingStop] = useState(null);

  const loadData = async () => {
    const [rows, sessions] = await Promise.all([
      base44.entities.FavoriteStop.list('sort_order', 50),
      base44.entities.RideSession.filter({ status: 'active' }, '-created_date', 1),
    ]);
    setFavorites(rows);
    setActiveSession(sessions[0] || null);
    setLoading(false);
  };

  // Reload whenever the Home tab becomes active so a stop armed from the
  // Search tab (which stays mounted) immediately shows up here.
  useEffect(() => {
    if (location.pathname === '/') loadData();
  }, [location.pathname]);

  const handleTap = (stop) => {
    // Tapping the card body opens details/ride view if armed, otherwise the arm sheet
    if (activeSession && activeSession.destination_stop_id === stop.stop_id) {
      navigate(`/ride/${encodeURIComponent(stop.stop_id)}`);
    } else {
      setPendingStop(stop);
    }
  };

  const handleConfirmArm = () => {
    const stop = pendingStop;
    setPendingStop(null);
    navigate(`/ride/${encodeURIComponent(stop.stop_id)}`);
  };

  const handleToggleFavorite = async (stop) => {
    // On Home, every shown stop is already a favorite — tapping the star removes it.
    if (stop.id) {
      await base44.entities.FavoriteStop.delete(stop.id);
      setFavorites((prev) => prev.filter((f) => f.id !== stop.id));
    }
  };

  const handleToggleArm = async (stop) => {
    const isArmed = activeSession && activeSession.destination_stop_id === stop.stop_id;
    if (isArmed) {
      // Disarm: cancel ALL active sessions to clear any orphans
      const active = await base44.entities.RideSession.filter({ status: 'active' });
      await Promise.all(
        active.map((s) => base44.entities.RideSession.update(s.id, {
          status: 'cancelled',
          ended_at: new Date().toISOString(),
        }))
      );
      setActiveSession(null);
    } else {
      // Arm: open the confirmation sheet
      setPendingStop(stop);
    }
  };

  return (
    <div className="px-5 pt-[env(safe-area-inset-top)] pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-6">
        <div className="flex items-center gap-3">
          <WakeStopLogo size={44} />
          <div>
            <div className="text-xl font-extrabold tracking-tight leading-none">Wake Stop NYC</div>
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

      {/* Armed banner */}
      {activeSession && (
        <div className="mb-4">
          <ArmedBanner session={activeSession} />
        </div>
      )}

      {/* Quick search bar */}
      <button
        onClick={() => navigate('/search')}
        className="w-full flex items-center gap-3 bg-secondary hover:bg-secondary/80 rounded-2xl px-4 h-14 text-left transition-colors"
      >
        <Search className="w-5 h-5 text-muted-foreground" />
        <span className="text-muted-foreground">Search stops, routes…</span>
      </button>

      {/* Favorites */}
      <PullToRefresh onRefresh={loadData}>
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
                <StopCard
                  stop={fav}
                  onTap={handleTap}
                  action="arm"
                  isArmed={activeSession?.destination_stop_id === fav.stop_id}
                  onToggleArm={handleToggleArm}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      </PullToRefresh>

      {/* Tip */}
      {favorites.length > 0 && !activeSession && (
        <div className="mt-8 bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div className="text-sm">
            <div className="font-semibold mb-0.5">Tap a stop to arm</div>
            <div className="text-muted-foreground">Pick a favorite, confirm, and we'll wake you up when you're close.</div>
          </div>
        </div>
      )}

      <ArmConfirmSheet
        stop={pendingStop}
        open={!!pendingStop}
        onClose={() => setPendingStop(null)}
        onConfirm={handleConfirmArm}
      />
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