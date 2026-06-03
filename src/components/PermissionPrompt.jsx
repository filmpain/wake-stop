import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MapPin, Smartphone, Vibrate, Volume2 } from 'lucide-react';
import { unlockAudio, vibrate, isVibrationSupported } from '@/lib/alerts';

const STORAGE_KEY = 'wakestop_permissions_prompted';

export default function PermissionPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const shouldAskNotifications = typeof Notification !== 'undefined' && Notification.permission === 'default';

    if (!localStorage.getItem(STORAGE_KEY) || shouldAskNotifications) {
      setShow(true);
      return;
    }

    if (navigator?.permissions?.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        if (status.state !== 'granted') setShow(true);
      });
    }
  }, []);

  const handleEnable = async () => {
    // Unlock audio + vibration — these require a user gesture, which this tap is.
    unlockAudio();
    if (isVibrationSupported()) vibrate('gentle');

    // Trigger the OS-level location prompt now. This is the key permission the app needs.
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          resolve,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });
    }

    // Request web notification permission when the browser/WebView supports it.
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
          className="fixed inset-0 z-[190] flex items-end justify-center"
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
            className="relative w-full max-w-md bg-card border-t border-border rounded-t-3xl p-6 pb-[calc(env(safe-area-inset-bottom)+2.5rem)] max-h-[82vh] overflow-y-auto"
          >
            <div className="w-12 h-1.5 rounded-full bg-border mx-auto mb-6" />

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <Bell className="w-7 h-7 text-primary" />
            </div>

            <h2 className="text-xl font-extrabold mb-2">Enable stop alerts</h2>
            <p className="text-sm text-muted-foreground mb-5">
              On Android and iPhone, allow location when prompted so Wake Stop can detect your stop. If a notification prompt appears, allow that too.
            </p>

            <div className="space-y-3 mb-6">
              <Row icon={MapPin} label="Location permission for stop detection" />
              <Row icon={Volume2} label="Sound alarm when your stop is near" />
              <Row icon={Vibrate} label="Vibration / haptic feedback" />
              <Row icon={Bell} label="Notifications when supported" />
              <Row icon={Smartphone} label="If no prompt appears, enable permissions in phone app settings" />
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