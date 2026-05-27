import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Vibrate, Volume2, Moon, Sun, Play, Trash2, AlertTriangle } from 'lucide-react';
import { useSettings } from '@/lib/useSettings';
import { useTheme } from '@/lib/ThemeContext';
import { SOUND_OPTIONS, HAPTIC_OPTIONS, triggerAlert } from '@/lib/alerts';
import { base44 } from '@/api/base44Client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, update, loaded } = useSettings();
  const { theme, setMode } = useTheme();

  if (!loaded) {
    return <div className="p-6 text-muted-foreground">Loading…</div>;
  }

  const testAlert = () => {
    triggerAlert(settings);
  };

  const handleDeleteAccount = async () => {
    // Wipe the user's data, then log them out. Their User record persists
    // (only admins can delete users), but all personal data is removed.
    const [favs, sessions, settingsRows] = await Promise.all([
      base44.entities.FavoriteStop.list(),
      base44.entities.RideSession.list(),
      base44.entities.UserSettings.list(),
    ]);
    await Promise.all([
      ...favs.map((f) => base44.entities.FavoriteStop.delete(f.id)),
      ...sessions.map((s) => base44.entities.RideSession.delete(s.id)),
      ...settingsRows.map((s) => base44.entities.UserSettings.delete(s.id)),
    ]);
    base44.auth.logout();
  };

  return (
    <div className="px-5 pt-[env(safe-area-inset-top)] pb-6">
      <div className="flex items-center gap-3 pt-4 pb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Settings</h1>
      </div>

      {/* Theme */}
      <Section title="Appearance">
        <div className="grid grid-cols-2 gap-2">
          <ThemeButton active={theme === 'light'} icon={Sun} label="Light" onClick={() => setMode('light')} />
          <ThemeButton active={theme === 'dark'} icon={Moon} label="Dark" onClick={() => setMode('dark')} />
        </div>
      </Section>

      {/* Alert type */}
      <Section title="Alert Type" icon={Bell}>
        <div className="space-y-2">
          <Choice value="sound" current={settings.alert_type} label="Sound only" onChange={v => update({ alert_type: v })} />
          <Choice value="haptic" current={settings.alert_type} label="Haptic only" onChange={v => update({ alert_type: v })} />
          <Choice value="both" current={settings.alert_type} label="Sound + Haptic" onChange={v => update({ alert_type: v })} />
        </div>
      </Section>

      {/* Sound */}
      {(settings.alert_type === 'sound' || settings.alert_type === 'both') && (
        <Section title="Alarm Sound" icon={Volume2}>
          <div className="space-y-2">
            {SOUND_OPTIONS.map(opt => (
              <Choice
                key={opt.value}
                value={opt.value}
                current={settings.alert_sound}
                label={opt.label}
                onChange={v => update({ alert_sound: v })}
              />
            ))}
          </div>
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Volume</div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => update({ volume: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
        </Section>
      )}

      {/* Haptic */}
      {(settings.alert_type === 'haptic' || settings.alert_type === 'both') && (
        <Section title="Vibration Pattern" icon={Vibrate}>
          <div className="space-y-2">
            {HAPTIC_OPTIONS.map(opt => (
              <Choice
                key={opt.value}
                value={opt.value}
                current={settings.haptic_pattern}
                label={opt.label}
                onChange={v => update({ haptic_pattern: v })}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Stops advance */}
      <Section title="Wake me up...">
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3].map(n => (
            <button
              key={n}
              onClick={() => update({ stops_advance_warning: n })}
              className={`h-16 rounded-2xl border-2 transition-all ${
                settings.stops_advance_warning === n
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card'
              }`}
            >
              <div className="text-2xl font-extrabold">{n}</div>
              <div className="text-[11px] text-muted-foreground">stop{n>1?'s':''} early</div>
            </button>
          ))}
        </div>
      </Section>

      {/* Test */}
      <button
        onClick={testAlert}
        className="w-full mt-4 h-14 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2"
      >
        <Play className="w-5 h-5" />
        Test alert
      </button>

      {/* Danger zone */}
      <Section title="Danger Zone" icon={AlertTriangle}>
        <div className="border-2 border-destructive/30 rounded-2xl p-4 bg-destructive/5">
          <div className="font-semibold text-sm mb-1">Delete account</div>
          <div className="text-xs text-muted-foreground mb-3">
            Permanently removes your favorites, ride history, and preferences. You'll be signed out.
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full h-11 rounded-xl bg-destructive text-destructive-foreground font-bold flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete account
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your favorites, ride sessions, and settings, then sign you out. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Section>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        Wake Stop · NYC MTA GTFS data<br />
        For best results, keep the app open during your ride.
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ThemeButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`h-16 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
        active ? 'border-primary bg-primary/10' : 'border-border bg-card'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

function Choice({ value, current, label, onChange }) {
  const active = value === current;
  return (
    <button
      onClick={() => onChange(value)}
      className={`w-full flex items-center justify-between h-12 px-4 rounded-xl border transition-colors ${
        active ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-secondary/50'
      }`}
    >
      <span className="font-medium text-sm">{label}</span>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        active ? 'border-primary' : 'border-muted-foreground'
      }`}>
        {active && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </div>
    </button>
  );
}