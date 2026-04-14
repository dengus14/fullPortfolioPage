import * as THREE from "three";
import { Sizes } from "./Utils/Sizes";
import { Time } from "./Utils/Time";
import { Mouse } from "./Utils/Mouse";
import { Camera } from "./Camera/Camera";
import { Renderer } from "./Renderer";
import { World } from "./World/World";

const MONITOR_POS    = new THREE.Vector3(-0.079, 1.821, 0);
const MONITOR_NORMAL = new THREE.Vector3(1, 0, 0);

export class Application {
  private sizes: Sizes;
  private time: Time;
  private mouse: Mouse;
  private camera: Camera;
  private renderer: Renderer;
  private world: World;
  private raycaster: THREE.Raycaster;
  private activeMonitor: string | null = null;
  private worldReady = false;
  private _camDir = new THREE.Vector3();
  private _lastFacing: boolean | null = null;
  private _monitorDirty = false;

  constructor() {
    this.sizes = new Sizes();
    this.time = new Time();
    this.mouse = new Mouse();
    this.renderer = new Renderer(this.sizes);
    this.camera = new Camera(this.sizes, this.mouse);
    this.raycaster = new THREE.Raycaster();

    this.world = new World((progress) => {
      const bar = document.getElementById("loading-bar");
      const text = document.getElementById("loading-text");
      if (bar) bar.style.width = `${Math.round(progress * 100)}%`;
      if (text) text.textContent = `Loading... ${Math.round(progress * 100)}%`;
    }, this.renderer.webgl);

    this.world.onReady(() => this.onWorldReady());
    this.time.onTick(() => this.update());

    // listen on window (not the canvas) so iframe clicks aren't intercepted
    // when zoomed in — the canvas toggles pointer-events off in that state
    window.addEventListener("click", (e) => this.handleClick(e));

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.returnToIdle();
    });
  }

  private onWorldReady() {
    document.getElementById("loading-screen")?.classList.add("hidden");
    this.worldReady = true;

    setTimeout(() => {
      document.getElementById("info-overlay")?.classList.add("visible");
      document.getElementById("monitor-hint")?.classList.add("visible");
    }, 800);
  }

  private handleClick(event: MouseEvent) {
    const mouse = new THREE.Vector2(
      (event.clientX / this.sizes.width) * 2 - 1,
      -(event.clientY / this.sizes.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera.instance);
    const intersects = this.raycaster.intersectObjects(this.world.hitboxes);

    if (intersects.length > 0) {
      const monitorId = intersects[0].object.userData.monitorId as string;

      if (this.activeMonitor === monitorId) {
        this.returnToIdle();
      } else {
        this.activeMonitor = monitorId;
        this._monitorDirty = true;
        this.camera.transition(monitorId === "left" ? "monitorLeft" : "monitorRight");
        const hint = document.getElementById("monitor-hint");
        if (hint) hint.textContent = "Click here to escape";
      }
    } else if (this.activeMonitor) {
      this.returnToIdle();
    }
  }

  private returnToIdle() {
    this.activeMonitor = null;
    this._monitorDirty = true;
    this.camera.transition("idle");
    const hint = document.getElementById("monitor-hint");
    if (hint) hint.textContent = "Click a monitor to explore";
  }

  private updateMonitorVisibility() {
    if (!this.worldReady) return;

    this._camDir.copy(this.camera.instance.position).sub(MONITOR_POS).normalize();
    const facing = MONITOR_NORMAL.dot(this._camDir) > 0.5;

    if (facing === this._lastFacing && !this._monitorDirty) return;
    this._lastFacing = facing;
    this._monitorDirty = false;

    this.renderer.cssActive = facing;
    // Chromium: canvas with pointer-events:auto steals clicks from the iframe
    // when both sit under a CSS3D transform chain. Disable while a monitor is active.
    this.renderer.webgl.domElement.style.pointerEvents = this.activeMonitor ? "none" : "auto";
    this.world.monitors.forEach((m) => {
      if (!facing) {
        m.hide();
      } else if (this.activeMonitor === m.id) {
        m.show(true);
      } else {
        m.show(false);
      }
    });
  }

  pauseRender()  { this.time.pause(); }
  resumeRender() { this.time.resume(); }

  private update() {
    this.camera.update(this.time.delta);
    this.updateMonitorVisibility();
    this.renderer.render(
      this.world.scene,
      this.world.cssScene,
      this.camera.instance
    );
  }
}
