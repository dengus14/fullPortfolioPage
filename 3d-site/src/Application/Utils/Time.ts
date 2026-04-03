export class Time {
  start: number;
  current: number;
  elapsed: number;
  delta: number;
  private callbacks: Array<() => void> = [];
  private rafId: number = 0;

  constructor() {
    this.start = performance.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 0;
    // Defer first tick so the initial delta is a real frame duration, not
    // however long model loading took between construction and first rAF.
    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  private tick(now: number) {
    this.delta = Math.min(now - this.current, 100); // clamp to 100ms (handles background tabs)
    this.current = now;
    this.elapsed = now - this.start;
    this.callbacks.forEach((fn) => fn());
    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  onTick(fn: () => void) {
    this.callbacks.push(fn);
  }

  pause() {
    cancelAnimationFrame(this.rafId);
  }

  resume() {
    this.current = performance.now();
    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  dispose() {
    cancelAnimationFrame(this.rafId);
  }
}
