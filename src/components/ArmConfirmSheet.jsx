import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X } from 'lucide-react';
import RouteBadge from './RouteBadge';

export default function ArmConfirmSheet({ stop, open, onClose, onConfirm }) {
  // Hide the bottom nav + lock scroll while the sheet is open.
  useEffect(() => {
    if (open) {
      document.body.classList.add('sheet-open');
    } else {
      document.body.classList.remove('sheet-open');
    }
    return () => document.body.classList.remove('sheet-open');
  }, [open]);

  // Android back gesture / button should close the sheet, not navigate away.
  useEffect(() => {
    if (!open) return;
    let closedByBack = false;
    window.history.pushState({ sheet: true }, '');
    const onPop = () => {
      closedByBack = true;
      onClose?.();
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      // If the sheet was closed via a button (not the back gesture), pop the
      // history entry we added so the back stack stays clean.
      if (!closedByBack && window.history.state?.sheet) {
        window.history.back();
      }
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && stop && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="pointer-events-auto w-full max-w-sm bg-card border border-border rounded-3xl px-6 pt-6 pb-6 max-h-[85vh] overflow-y-auto shadow-2xl"
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
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}