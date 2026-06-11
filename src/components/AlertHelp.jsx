import React, { useState } from 'react';
import { ChevronDown, VolumeX, BellOff, Volume1, BatteryLow } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIPS = [
  {
    icon: VolumeX,
    title: 'Silent mode / mute switch',
    body: 'iPhone: flip the side switch to Ring (no orange showing). Android: make sure the phone is not in Silent or Vibrate-only mode in your volume controls.',
  },
  {
    icon: BellOff,
    title: 'Do Not Disturb',
    body: 'DND can silence alarms even when the phone isn\'t muted. Turn DND off before your ride, or add Wake Stop to your DND exceptions (Settings → Do Not Disturb → Apps/Exceptions).',
  },
  {
    icon: Volume1,
    title: 'Media volume',
    body: 'Our alarm plays through the Media channel. On Android, raise the Media volume slider (not just Ringer). Use the Test alert button below to confirm you can hear it.',
  },
  {
    icon: BatteryLow,
    title: 'Battery optimization (Android)',
    body: 'To keep GPS tracking active with the screen off, set Wake Stop\'s battery usage to Unrestricted: Settings → Apps → Wake Stop → App battery usage → Unrestricted.',
  },
];

export default function AlertHelp() {
  const [open, setOpen] = useState(null);

  return (
    <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
      {TIPS.map((tip, i) => {
        const Icon = tip.icon;
        const isOpen = open === i;
        return (
          <div key={tip.title}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-foreground" />
              </div>
              <span className="flex-1 font-semibold text-sm">{tip.title}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 pl-16 text-sm text-muted-foreground">{tip.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}