import React from 'react';
import { motion } from 'framer-motion';
import { Star, Train, Bus, ChevronRight, Check, Bell } from 'lucide-react';
import RouteBadge from './RouteBadge';

export default function StopCard({ stop, onTap, onToggleFavorite, isFavorite, onToggleArm, isArmed, onArm, action = 'chevron' }) {
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
          <div className="flex items-center gap-2 self-center">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(stop); }}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary"
              aria-label="Toggle favorite"
            >
              <Star
                className={`w-5 h-5 ${isFavorite ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
              />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onArm?.(stop); }}
              className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-primary text-primary-foreground text-xs font-bold"
              aria-label="Arm alarm"
            >
              <Bell className="w-4 h-4" />
              Alarm
            </button>
          </div>
        ) : action === 'arm' ? (
          <div className="flex items-center gap-2 self-center">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(stop); }}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-5 h-5 ${isFavorite ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
              />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleArm?.(stop); }}
              className="flex flex-col items-center gap-1 px-1"
              aria-label={isArmed ? 'Disarm alarm' : 'Arm alarm'}
              aria-pressed={isArmed}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-colors ${
                  isArmed
                    ? 'bg-green-500 border-green-500'
                    : 'bg-transparent border-muted-foreground/40'
                }`}
              >
                {isArmed && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isArmed ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'}`}>
                {isArmed ? 'Armed' : 'Off'}
              </span>
            </button>
          </div>
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground self-center" />
        )}
      </div>
    </motion.button>
  );
}