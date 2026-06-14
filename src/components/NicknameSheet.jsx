import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pencil, Trash2 } from 'lucide-react';

export default function NicknameSheet({ stop, open, onClose, onSave }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (open && stop) {
      setValue(stop.nickname || '');
    }
  }, [open, stop]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    let closedByBack = false;
    window.history.pushState({ sheet: true }, '');

    const onPop = () => {
      closedByBack = true;
      onClose?.();
    };

    window.addEventListener('popstate', onPop);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', onPop);
      if (!closedByBack && window.history.state?.sheet) {
        window.history.back();
      }
    };
  }, [open, onClose]);

  const handleSave = () => {
    const trimmed = value.trim();
    onSave?.(trimmed || null);
    onClose?.();
  };

  const handleClear = () => {
    onSave?.(null);
    onClose?.();
  };

  return createPortal(
    <AnimatePresence>
      {open && stop && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:max-w-sm bg-card border border-border rounded-t-3xl sm:rounded-3xl px-6 pt-6 pb-8 max-h-[85dvh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Nickname</div>
                <div className="text-lg font-bold leading-tight truncate">{stop.stop_name}</div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Pencil className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Home, Work, Gym…"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                className="w-full h-14 bg-secondary rounded-2xl pl-11 pr-4 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2 mt-4">
              {stop.nickname && (
                <button
                  onClick={handleClear}
                  className="h-11 px-3 rounded-xl border border-destructive/30 text-destructive flex items-center gap-1.5 text-sm font-bold hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              )}
              <button
                onClick={handleSave}
                className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-bold"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}