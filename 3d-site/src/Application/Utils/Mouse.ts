export class Mouse {
  x: number = 0;
  y: number = 0;
  // normalized -1 to +1
  nx: number = 0;
  ny: number = 0;
  inMonitorLeft: boolean = false;
  inMonitorRight: boolean = false;

  constructor() {
    window.addEventListener("mousemove", (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      this.nx = (e.clientX / window.innerWidth) * 2 - 1;
      this.ny = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // relay mouse events from iframes so parallax still works when hovering the monitor
    window.addEventListener("message", (event) => {
      const data = event.data;
      if (!data || !data.type) return;

      if (data.type === "mousemove") {
        this.nx = data.nx ?? this.nx;
        this.ny = data.ny ?? this.ny;
      }
    });
  }
}
