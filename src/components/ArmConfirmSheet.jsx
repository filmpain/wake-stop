import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Volume2, Vibrate, Bell } from 'lucide-react';
import RouteBadge from './RouteBadge';
import { useSettings } from '@/lib/useSettings';

const ALERT_TYPES = [
  { value: 'sound', label: 'Sound', icon: Volume2 },
  { value: 'haptic', label: 'Haptic', icon: Vibrate },
  { value: 'both', label: 'Both', icon: Bell },
];

export default function ArmConfirmSheet({ stop, open, onClose, onConfirm }) {
  const { settings, update } = useSettings();

  // Lock background scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Android back gesture / button should close the modal, not navigate away.
  useEffect(() => {
    if (!open) return;
    let closedByBack = false;
    window.history.pushState({ sheet: true }, '');

    const onPop = () => {
      closedByBack = true;
      onClose?.();
    };

    const onNativeBack = (e) => {
      e.preventDefault();
      closedByBack = true;
      onClose?.();
    };

    window.addEventListener('popstate', onPop);
    document.addEventListener('backbutton', onNativeBack, false);

    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('backbutton', onNativeBack, false);
      if (!closedByBack && window.history.state?.sheet) {
        window.history.back();
      }
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && stop && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-sm bg-card border border-border rounded-3xl px-6 pt-6 pb-6 max-h-[85dvh] overflow-y-auto shadow-2xl"
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

            {/* Stops before */}
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Wake me up</div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => update({ stops_advance_warning: n })}
                    className={`h-14 rounded-xl border-2 transition-all ${
                      settings.stops_advance_warning === n
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className="text-lg font-extrabold leading-none">{n}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">stop{n > 1 ? 's' : ''} early</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Alert type */}
            <div className="mb-5">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Alert type</div>
              <div className="grid grid-cols-3 gap-2">
                {ALERT_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => update({ alert_type: value })}
                    className={`h-14 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                      settings.alert_type === value
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-semibold">{label}</span>
                  </button>
                ))}
              </div>
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
      )}
    </AnimatePresence>,
    document.body
  );
}