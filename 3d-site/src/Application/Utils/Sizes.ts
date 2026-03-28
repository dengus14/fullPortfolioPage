export class Sizes {
  width: number;
  height: number;
  pixelRatio: number;
  private listeners: Array<() => void> = [];

  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.listeners.forEach((fn) => fn());
    });
  }

  onChange(fn: () => void) {
    this.listeners.push(fn);
  }
}
