export class Sizes {
  width: number;
  height: number;
  pixelRatio: number;
  private listeners: Array<() => void> = [];

  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 1.5);

    let resizeTimer: ReturnType<typeof setTimeout>;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 1.5);
        this.listeners.forEach((fn) => fn());
      }, 150);
    });
  }

  onChange(fn: () => void) {
    this.listeners.push(fn);
  }
}
