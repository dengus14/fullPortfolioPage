import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MonitorScreen } from "./MonitorScreen";
import { buildVSCodeTexture } from "./MacbookScreen";

type LoadCallback = (progress: number) => void;
type ReadyCallback = () => void;

export class World {
  scene: THREE.Scene;
  cssScene: THREE.Scene;
  monitors: MonitorScreen[] = [];
  hitboxes: THREE.Mesh[] = [];
  private onLoadCallbacks: ReadyCallback[] = [];

  constructor(onProgress?: LoadCallback, renderer?: THREE.WebGLRenderer) {
    this.scene = new THREE.Scene();
    this.cssScene = new THREE.Scene();

    if (renderer) {
      // pbr materials need an environment map — RoomEnvironment gives neutral studio-like reflections
      const pmrem = new THREE.PMREMGenerator(renderer);
      this.scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;
      pmrem.dispose();
    }

    this.setupLighting();
    this.loadModel(onProgress);
    this.setupMonitors();
  }

  private setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff4e0, 1.2);
    key.position.set(3, 5, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); // 2048 was overkill for a desk scene
    key.shadow.camera.near = 0.1;
    key.shadow.camera.far = 50;
    key.shadow.camera.left = -3; // tighter frustum = more shadow texels on the actual scene
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 3;
    key.shadow.camera.bottom = -3;
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xd0e8ff, 0.4);
    fill.position.set(-3, 2, -1);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.2);
    rim.position.set(0, 3, -5);
    this.scene.add(rim);

    const glowMonitor = new THREE.PointLight(0x88aaff, 0.5, 2);
    glowMonitor.position.set(-0.079, 1.821, 0);
    this.scene.add(glowMonitor);

    const glowMac = new THREE.PointLight(0x6688ff, 0.3, 1.5);
    glowMac.position.set(-0.033, 1.43, -1.31);
    this.scene.add(glowMac);
  }

  private loadModel(onProgress?: LoadCallback) {
    const loader = new GLTFLoader();
    const vsCodeTexture = buildVSCodeTexture(1640, 1024);

    loader.load(
      "/gaming_scene.glb",
      (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // hide the monitor screen mesh — the css3d iframe overlays it
          if (child.name === "monitor_screen") {
            mesh.visible = false;
            return;
          }

          // swap macbook screen material so the canvas texture inherits the correct uvs
          if (child.name === "Object_123") {
            mesh.material = new THREE.MeshBasicMaterial({
              map: vsCodeTexture,
              toneMapped: false,
            });
          }
        });

        this.scene.add(model);
        this.onLoadCallbacks.forEach((fn) => fn());
      },
      (xhr) => {
        if (xhr.total > 0 && onProgress) {
          onProgress(xhr.loaded / xhr.total);
        }
      },
      (err) => {
        console.error("glb load error:", err);
      }
    );
  }

  private setupMonitors() {
    const main = new MonitorScreen("left", this.cssScene, this.scene);
    this.monitors = [main];
    this.hitboxes = [main.getHitbox()];
  }

  onReady(fn: ReadyCallback) {
    this.onLoadCallbacks.push(fn);
  }
}
