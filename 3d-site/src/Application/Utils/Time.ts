export class Time {
  start: number;
  current: number;
  elapsed: number;
  delta: number;
  private callbacks: Array<() => void> = [];
  private rafId: number = 0;

  constructor() {
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.tick();
  }

  private tick() {
    const now = Date.now();
    this.delta = now - this.current;
    this.current = now;
    this.elapsed = now - this.start;
    this.callbacks.forEach((fn) => fn());
    this.rafId = requestAnimationFrame(() => this.tick());
  }

  onTick(fn: () => void) {
    this.callbacks.push(fn);
  }

  pause() {
    cancelAnimationFrame(this.rafId);
  }

  resume() {
    this.current = Date.now();
    this.tick();
  }

  dispose() {
    cancelAnimationFrame(this.rafId);
  }
}
