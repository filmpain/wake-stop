import React from 'react';
import { motion } from 'framer-motion';
import { Star, Train, Bus, ChevronRight } from 'lucide-react';
import RouteBadge from './RouteBadge';

export default function StopCard({ stop, onTap, onToggleFavorite, isFavorite, action = 'chevron' }) {
  const Icon = stop.stop_type === 'subway' ? Train : Bus;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onTap?.(stop)}
      className="w-full text-left bg-card hover:bg-secondary/60 border border-border rounded-2xl p-4 transition-colors active:bg-secondary"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {stop.nickname && (
              <span className="text-xs font-bold uppercase tracking-wider text-accent">{stop.nickname}</span>
            )}
          </div>
          <div className="font-semibold text-base text-foreground truncate">{stop.stop_name}</div>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {(stop.routes || []).slice(0, 6).map(r => (
              <RouteBadge key={r} route={r} size="sm" />
            ))}
            {(stop.routes || []).length > 6 && (
              <span className="text-xs text-muted-foreground">+{stop.routes.length - 6}</span>
            )}
          </div>
        </div>
        {action === 'favorite' ? (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(stop); }}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary"
            aria-label="Toggle favorite"
          >
            <Star
              className={`w-5 h-5 ${isFavorite ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
            />
          </button>
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground self-center" />
        )}
      </div>
    </motion.button>
  );
}