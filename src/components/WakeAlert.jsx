import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import RouteBadge from './RouteBadge';
import { useSettings } from '@/lib/useSettings';
import { triggerAlert } from '@/lib/alerts';

export default function WakeAlert({ stopName, routes, onDismiss }) {
  const { settings } = useSettings();

  // Re-trigger alert every 3 seconds until dismissed
  useEffect(() => {
    const id = setInterval(() => {
      triggerAlert(settings);
    }, 3000);
    return () => clearInterval(id);
  }, [settings]);

  return (
    <div className="fixed inset-0 z-50 wake-flash flex flex-col items-center justify-center p-6 text-black">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/20 mb-6">
          <Bell className="w-10 h-10" />
        </div>
        <div className="text-sm font-black uppercase tracking-[0.3em] mb-3">Wake up!</div>
        <div className="text-5xl sm:text-6xl font-black leading-tight">
          {stopName}
        </div>
        <div className="text-lg font-bold uppercase tracking-widest mt-3">Your stop is next</div>
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {(routes || []).map(r => <RouteBadge key={r} route={r} size="lg" />)}
        </div>
      </motion.div>

      <motion.button
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onDismiss}
        className="mt-12 h-16 px-12 rounded-full bg-black text-white font-black text-lg uppercase tracking-widest"
      >
        I'm awake
      </motion.button>
    </div>
  );
}