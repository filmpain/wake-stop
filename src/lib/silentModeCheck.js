// Browsers can't read the silent switch / DND state directly.
// iOS heuristic: when the mute switch is on, a short audio buffer "plays"
// instantly instead of taking its real duration. We measure elapsed time.
// Returns: 'muted' | 'audible' | 'unknown'
export function checkSilentMode() {
  return new Promise((resolve) => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return resolve('unknown');

    const ctx = new Ctx();

    const run = () => {
      const durationSec = 0.12;
      const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * durationSec), ctx.sampleRate);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const start = performance.now();
      let settled = false;

      source.onended = () => {
        if (settled) return;
        settled = true;
        const elapsed = performance.now() - start;
        ctx.close();
        // Finished way faster than real time → hardware mute switch is on (iOS)
        resolve(elapsed < durationSec * 1000 * 0.4 ? 'muted' : 'audible');
      };

      // Safety timeout — some platforms never fire onended for silent buffers
      setTimeout(() => {
        if (settled) return;
        settled = true;
        ctx.close();
        resolve('unknown');
      }, 1000);

      source.start(0);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(run).catch(() => {
        ctx.close();
        resolve('unknown');
      });
    } else {
      run();
    }
  });
}