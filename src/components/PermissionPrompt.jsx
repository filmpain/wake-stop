import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Vibrate, Volume2 } from 'lucide-react';
import { unlockAudio, vibrate, isVibrationSupported } from '@/lib/alerts';

const STORAGE_KEY = 'wakestop_permissions_prompted';

export default function PermissionPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setShow(true);
    }
  }, []);

  const handleEnable = async () => {
    // Unlock audio + vibration — these require a user gesture, which this tap is.
    unlockAudio();
    if (isVibrationSupported()) vibrate('gentle');

    // Request system notification permission (if available).
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch (e) { /* ignore */ }
    }

    localStorage.setItem(STORAGE_KEY, '1');
    setShow(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={handleDismiss} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-card border-t border-border rounded-t-3xl p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"
          >
            <div className="w-12 h-1.5 rounded-full bg-border mx-auto mb-6" />

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <Bell className="w-7 h-7 text-primary" />
            </div>

            <h2 className="text-xl font-extrabold mb-2">Enable alerts</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Wake Stop needs permission to alert you with sound and vibration so you never miss your stop.
            </p>

            <div className="space-y-3 mb-6">
              <Row icon={Volume2} label="Sound alarm when your stop is near" />
              <Row icon={Vibrate} label="Vibration / haptic feedback" />
              <Row icon={Bell} label="Notifications" />
            </div>

            <button
              onClick={handleEnable}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold"
            >
              Enable alerts
            </button>
            <button
              onClick={handleDismiss}
              className="w-full h-12 mt-2 rounded-2xl text-muted-foreground font-semibold"
            >
              Not now
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-foreground" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}