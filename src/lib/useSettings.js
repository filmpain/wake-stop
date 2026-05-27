import { useEffect, useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const DEFAULTS = {
  theme: 'dark',
  alert_type: 'both',
  alert_sound: 'alarm',
  haptic_pattern: 'escalating',
  stops_advance_warning: 2,
  volume: 0.8,
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [settingsId, setSettingsId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const rows = await base44.entities.UserSettings.list('-updated_date', 1);
      if (!active) return;
      if (rows && rows.length > 0) {
        setSettings({ ...DEFAULTS, ...rows[0] });
        setSettingsId(rows[0].id);
      }
      setLoaded(true);
    })();
    return () => { active = false; };
  }, []);

  const update = useCallback(async (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    if (settingsId) {
      await base44.entities.UserSettings.update(settingsId, patch);
    } else {
      const created = await base44.entities.UserSettings.create(next);
      setSettingsId(created.id);
    }
  }, [settings, settingsId]);

  return { settings, update, loaded };
}