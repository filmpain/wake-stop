import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VolumeX, RefreshCw, X } from 'lucide-react';
import { checkSilentMode } from '@/lib/silentModeCheck';

// Shows a warning banner when the phone appears to be muted (silent switch)
// and the alarm relies on sound. DND can't be read by web apps, so we also
// remind the user to check it.
export default function SilentModeWarning({ enabled }) {
  const [status, setStatus] = useState('unknown');
  const [dismissed, setDismissed] = useState(false);
  const [checking, setChecking] = useState(false);

  const runCheck = useCallback(async () => {
    setChecking(true);
    const result = await checkSilentMode();
    setStatus(result);
    if (result !== 'muted') setDismissed(false);
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    runCheck();
  }, [enabled, runCheck]);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {status === 'muted' && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="bg-accent/15 border border-accent/40 rounded-2xl p-4 mb-4 flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-accent/25 flex items-center justify-center shrink-0">
            <VolumeX className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">Phone seems to be on silent</div>
            <div className="text-xs text-muted-foreground mt-1">
              Your alarm sound may not play. Flip the mute switch off and check Do Not Disturb. Vibration will still fire.
            </div>
            <button
              onClick={runCheck}
              disabled={checking}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-accent disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
              Check again
            </button>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}