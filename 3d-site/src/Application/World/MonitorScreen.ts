import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

export type MonitorId = "left" | "right";

interface MonitorConfig {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  width: number;
  height: number;
  url: string;
  iframeWidth: number;
  iframeHeight: number;
}

// monitor_screen mesh: center (-0.079, 1.821, 0), normal (1,0,0), size Z=1.483 × Y=0.761
// scale factor: 1000 css px = 1 world unit
const SCALE_FACTOR = 1 / 1000;

const INNER_SITE_URL = `${window.location.protocol}//${window.location.hostname}:5174`;

const CONFIGS: Record<MonitorId, MonitorConfig> = {
  left: {
    position: new THREE.Vector3(-0.079, 1.821, 0.0),
    rotation: new THREE.Euler(0, Math.PI / 2, 0),
    width: 1483 * SCALE_FACTOR,
    height: 761 * SCALE_FACTOR,
    url: INNER_SITE_URL,
    iframeWidth: 1483,
    iframeHeight: 761,
  },
  right: {
    position: new THREE.Vector3(-0.079, 1.821, 0.0),
    rotation: new THREE.Euler(0, Math.PI / 2, 0),
    width: 1483 * SCALE_FACTOR,
    height: 761 * SCALE_FACTOR,
    url: INNER_SITE_URL,
    iframeWidth: 1483,
    iframeHeight: 761,
  },
};

export class MonitorScreen {
  cssObject: CSS3DObject;
  iframe: HTMLIFrameElement;
  private plane: THREE.Mesh;
  id: MonitorId;

  constructor(id: MonitorId, cssScene: THREE.Scene, scene: THREE.Scene) {
    this.id = id;
    const cfg = CONFIGS[id];

    this.iframe = document.createElement("iframe");
    this.iframe.src = cfg.url;
    this.iframe.style.width = `${cfg.iframeWidth}px`;
    this.iframe.style.height = `${cfg.iframeHeight}px`;
    this.iframe.style.border = "none";
    this.iframe.style.borderRadius = "4px";
    this.iframe.style.background = "#000";
    this.iframe.style.pointerEvents = "auto";
    this.iframe.style.backfaceVisibility = "hidden";
    (this.iframe.style as CSSStyleDeclaration & { webkitBackfaceVisibility: string }).webkitBackfaceVisibility = "hidden";

    this.cssObject = new CSS3DObject(this.iframe);
    this.cssObject.position.copy(cfg.position);
    this.cssObject.rotation.copy(cfg.rotation);
    const s = SCALE_FACTOR;
    this.cssObject.scale.set(s, s, s);
    this.cssObject.element.style.backfaceVisibility = "hidden";
    (this.cssObject.element.style as CSSStyleDeclaration & { webkitBackfaceVisibility: string }).webkitBackfaceVisibility = "hidden";
    this.cssObject.element.style.transition = "opacity 0.4s ease";
    this.cssObject.element.style.opacity = "0";
    this.cssObject.element.style.pointerEvents = "none";
    cssScene.add(this.cssObject);

    // transparent plane in the webgl scene — acts as raycasting hitbox for click detection
    const geo = new THREE.PlaneGeometry(cfg.width, cfg.height);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.plane = new THREE.Mesh(geo, mat);
    this.plane.position.copy(cfg.position);
    this.plane.rotation.copy(cfg.rotation);
    this.plane.name = `monitor_hitbox_${id}`;
    this.plane.userData.monitorId = id;
    scene.add(this.plane);
  }

  getHitbox(): THREE.Mesh {
    return this.plane;
  }

  // pass interactive=true only after the camera has zoomed in — otherwise the iframe
  // swallows clicks before the webgl raycaster can detect them
  show(interactive = false) {
    this.cssObject.element.style.opacity = "1";
    this.iframe.style.pointerEvents = interactive ? "auto" : "none";
  }

  hide() {
    this.cssObject.element.style.opacity = "0";
    this.iframe.style.pointerEvents = "none";
  }

  enablePointerEvents(enabled: boolean) {
    if (enabled) this.show(true); else this.hide();
  }
}
