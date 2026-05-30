// Audio + haptic alert utilities. Uses Web Audio API (no asset files needed).

let audioCtx = null;
function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  return audioCtx;
}

function playTone({ freq, duration, type = 'sine', volume = 0.8, delay = 0 }) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.05);
}

// Call this from a user gesture (e.g. tapping "Arm") so the AudioContext is
// allowed to produce sound later from a non-gesture callback (the GPS alert).
export function unlockAudio() {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  // Play a near-silent blip to fully "unlock" on iOS/Android.
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) { /* ignore */ }
}

export function playSound(soundName, volume = 0.8) {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  switch (soundName) {
    case 'chime':
      playTone({ freq: 880, duration: 0.4, type: 'sine', volume });
      playTone({ freq: 1320, duration: 0.5, type: 'sine', volume, delay: 0.15 });
      break;
    case 'alarm':
      for (let i = 0; i < 4; i++) {
        playTone({ freq: 880, duration: 0.18, type: 'square', volume, delay: i * 0.3 });
        playTone({ freq: 660, duration: 0.18, type: 'square', volume, delay: i * 0.3 + 0.15 });
      }
      break;
    case 'bell':
      playTone({ freq: 1568, duration: 1.2, type: 'triangle', volume });
      playTone({ freq: 2093, duration: 1.0, type: 'triangle', volume: volume * 0.6, delay: 0.05 });
      break;
    case 'buzzer':
      playTone({ freq: 220, duration: 0.6, type: 'sawtooth', volume });
      break;
    case 'gentle':
      playTone({ freq: 523, duration: 0.3, type: 'sine', volume: volume * 0.7 });
      playTone({ freq: 659, duration: 0.3, type: 'sine', volume: volume * 0.7, delay: 0.3 });
      playTone({ freq: 784, duration: 0.5, type: 'sine', volume: volume * 0.7, delay: 0.6 });
      break;
    default:
      playTone({ freq: 880, duration: 0.4, type: 'sine', volume });
  }
}

export function isVibrationSupported() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export function vibrate(pattern) {
  if (!isVibrationSupported()) {
    console.warn('[haptic] navigator.vibrate not available in this WebView/browser');
    return false;
  }
  const patterns = {
    gentle: [300],
    strong: [800],
    escalating: [300, 150, 400, 150, 600, 150, 900],
    sos: [200, 100, 200, 100, 200, 300, 600, 100, 600, 100, 600, 300, 200, 100, 200, 100, 200],
  };
  try {
    // Cancel anything currently running so a new call always fires.
    navigator.vibrate(0);
    const ok = navigator.vibrate(patterns[pattern] || patterns.escalating);
    if (!ok) console.warn('[haptic] navigator.vibrate returned false (blocked or disabled)');
    return ok;
  } catch (e) {
    console.warn('[haptic] vibrate threw', e);
    return false;
  }
}

export function triggerAlert({ alert_type, alert_sound, haptic_pattern, volume }) {
  if (alert_type === 'sound' || alert_type === 'both') {
    playSound(alert_sound, volume);
  }
  if (alert_type === 'haptic' || alert_type === 'both') {
    vibrate(haptic_pattern);
  }
}

export const SOUND_OPTIONS = [
  { value: 'chime', label: 'Chime' },
  { value: 'alarm', label: 'Alarm Bell' },
  { value: 'bell', label: 'High Bell' },
  { value: 'buzzer', label: 'Buzzer' },
  { value: 'gentle', label: 'Gentle Tones' },
];

export const HAPTIC_OPTIONS = [
  { value: 'gentle', label: 'Gentle Pulse' },
  { value: 'strong', label: 'Strong Buzz' },
  { value: 'escalating', label: 'Escalating' },
  { value: 'sos', label: 'SOS Pattern' },
];