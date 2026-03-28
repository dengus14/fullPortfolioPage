import * as THREE from "three";
import { Sizes } from "../Utils/Sizes";
import { Mouse } from "../Utils/Mouse";

export type CameraState = "idle" | "monitorLeft" | "monitorRight";

interface Keyframe {
  position: THREE.Vector3;
  target: THREE.Vector3;
  duration: number;
}

// monitor_screen center: (-0.079, 1.821, 0), normal: +X
const KEYFRAMES: Record<string, Keyframe> = {
  idle: {
    position: new THREE.Vector3(3.5, 2.8, 0),
    target: new THREE.Vector3(-0.079, 1.5, 0),
    duration: 1200,
  },
  monitorLeft: {
    position: new THREE.Vector3(0.9, 1.821, 0),
    target: new THREE.Vector3(-0.079, 1.821, 0),
    duration: 1000,
  },
  monitorRight: {
    position: new THREE.Vector3(0.9, 1.821, 0),
    target: new THREE.Vector3(-0.079, 1.821, 0),
    duration: 1000,
  },
};

export class Camera {
  instance: THREE.PerspectiveCamera;
  private state: CameraState = "idle";
  private targetPosition = new THREE.Vector3();
  private targetLookAt = new THREE.Vector3();
  private currentLookAt = new THREE.Vector3();

  constructor(
    private sizes: Sizes,
    private mouse: Mouse,
  ) {
    this.instance = new THREE.PerspectiveCamera(
      50,
      sizes.width / sizes.height,
      0.01,
      1000
    );

    const idle = KEYFRAMES.idle;
    this.instance.position.copy(idle.position);
    this.targetPosition.copy(idle.position);
    this.targetLookAt.copy(idle.target);
    this.currentLookAt.copy(idle.target);

    sizes.onChange(() => this.onResize());
  }

  transition(state: CameraState) {
    const kf = KEYFRAMES[state];
    if (!kf) return;

    this.state = state;
    this.targetPosition.copy(kf.position);
    this.targetLookAt.copy(kf.target);
  }

  update(deltaMs: number) {
    // subtle parallax drift in Z/Y while at idle
    if (this.state === "idle") {
      const idleKf = KEYFRAMES.idle;
      const pz = idleKf.position.z + this.mouse.nx * 0.5;
      const py = idleKf.position.y + this.mouse.ny * 0.2;
      this.targetPosition.set(idleKf.position.x, py, pz);
    }

    // delta-time independent lerp so speed is consistent at any frame rate
    const alpha = 1 - Math.pow(0.96, deltaMs / 16.667);
    this.instance.position.lerp(this.targetPosition, alpha);
    this.currentLookAt.lerp(this.targetLookAt, alpha);
    this.instance.lookAt(this.currentLookAt);
  }

  private onResize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
}
