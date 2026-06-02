import React, { useState } from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Shows active MTA service alerts for the armed route(s) as a collapsible banner.
export default function ServiceAlertBanner({ alerts }) {
  const [openId, setOpenId] = useState(null);

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {alerts.map((alert) => {
        const open = openId === alert.id;
        return (
          <div
            key={alert.id}
            className="border-2 border-accent/40 bg-accent/10 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpenId(open ? null : alert.id)}
              className="w-full flex items-start gap-3 p-4 text-left"
            >
              <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-widest text-accent mb-1">
                  Service alert
                </div>
                <div className="text-sm font-semibold leading-snug">{alert.header}</div>
              </div>
              {alert.description && (
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform ${open ? 'rotate-180' : ''}`}
                />
              )}
            </button>
            <AnimatePresence>
              {open && alert.description && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                    {alert.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}