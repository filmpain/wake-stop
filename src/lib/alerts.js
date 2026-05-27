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

export function vibrate(pattern) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return false;
  const patterns = {
    gentle: [200],
    strong: [600],
    escalating: [200, 100, 300, 100, 500, 100, 800],
    sos: [200, 100, 200, 100, 200, 300, 600, 100, 600, 100, 600, 300, 200, 100, 200, 100, 200],
  };
  try {
    navigator.vibrate(patterns[pattern] || patterns.escalating);
    return true;
  } catch (e) {
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