import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X } from 'lucide-react';
import RouteBadge from './RouteBadge';

export default function ArmConfirmSheet({ stop, open, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {open && stop && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-3xl p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] max-w-md mx-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Arm alarm for</div>
                <div className="text-2xl font-extrabold mt-1 leading-tight">{stop.stop_name}</div>
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {(stop.routes || []).map(r => <RouteBadge key={r} route={r} size="sm" />)}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-5">
              We'll monitor your location and wake you up when you're approaching this stop.
            </p>

            <button
              onClick={onConfirm}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Zap className="w-5 h-5" />
              Arm alarm
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}