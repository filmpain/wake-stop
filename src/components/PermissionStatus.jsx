import React, { useEffect, useState } from 'react';
import { MapPin, Bell, Vibrate, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { isVibrationSupported, unlockAudio, vibrate } from '@/lib/alerts';

function StatusBadge({ state }) {
  if (state === 'granted' || state === 'supported') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-500">
        <CheckCircle2 className="w-4 h-4" /> On
      </span>
    );
  }
  if (state === 'denied' || state === 'unsupported') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive">
        <XCircle className="w-4 h-4" /> Off
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-accent">
      <AlertCircle className="w-4 h-4" /> Not asked
    </span>
  );
}

export default function PermissionStatus() {
  const [location, setLocation] = useState('checking');
  const [notifications, setNotifications] = useState('checking');
  const vibration = isVibrationSupported() ? 'supported' : 'unsupported';

  const refresh = async () => {
    // Location
    if (navigator?.permissions?.query) {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        setLocation(status.state); // granted | denied | prompt
        status.onchange = () => setLocation(status.state);
      } catch {
        setLocation('prompt');
      }
    } else {
      setLocation('prompt');
    }

    // Notifications
    if (typeof Notification !== 'undefined') {
      setNotifications(Notification.permission === 'default' ? 'prompt' : Notification.permission);
    } else {
      setNotifications('unsupported');
    }
  };

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const requestLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      () => refresh(),
      () => refresh(),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const requestNotifications = async () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch { /* ignore */ }
    }
    refresh();
  };

  const testVibration = () => {
    unlockAudio();
    vibrate('gentle');
  };

  const denied = location === 'denied' || notifications === 'denied';

  return (
    <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
      <PermRow
        icon={MapPin}
        label="Location"
        sub="Required to detect your stop"
        state={location}
        actionLabel={location === 'prompt' ? 'Enable' : null}
        onAction={requestLocation}
      />
      <PermRow
        icon={Bell}
        label="Notifications"
        sub="Alerts when the app is in background"
        state={notifications}
        actionLabel={notifications === 'prompt' ? 'Enable' : null}
        onAction={requestNotifications}
      />
      <PermRow
        icon={Vibrate}
        label="Vibration"
        sub="Haptic wake-up alerts"
        state={vibration}
        actionLabel={vibration === 'supported' ? 'Test' : null}
        onAction={testVibration}
      />
      {denied && (
        <div className="p-4 bg-destructive/5 text-xs text-muted-foreground">
          A permission was denied. To fix it, open your phone's <span className="font-semibold text-foreground">Settings → Apps → Wake Stop</span>, then enable <span className="font-semibold text-foreground">Notifications</span> and set <span className="font-semibold text-foreground">Location</span> to "Allow while using the app".
        </div>
      )}
    </div>
  );
}

function PermRow({ icon: Icon, label, sub, state, actionLabel, onAction }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <StatusBadge state={state} />
      {actionLabel && (
        <button
          onClick={onAction}
          className="h-8 px-3 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}