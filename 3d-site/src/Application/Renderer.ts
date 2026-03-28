import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { Sizes } from "./Utils/Sizes";

export class Renderer {
  webgl: THREE.WebGLRenderer;
  css3d: CSS3DRenderer;

  constructor(private sizes: Sizes) {
    this.webgl = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    this.webgl.setClearColor(0xc8c8c8);
    this.webgl.setSize(sizes.width, sizes.height);
    this.webgl.setPixelRatio(sizes.pixelRatio);
    this.webgl.outputColorSpace = THREE.SRGBColorSpace;
    this.webgl.toneMapping = THREE.ACESFilmicToneMapping;
    this.webgl.toneMappingExposure = 1.2;
    this.webgl.shadowMap.enabled = true;
    this.webgl.shadowMap.type = THREE.PCFSoftShadowMap;
    this.webgl.domElement.classList.add("webgl");
    document.getElementById("app")!.prepend(this.webgl.domElement);

    this.css3d = new CSS3DRenderer();
    this.css3d.setSize(sizes.width, sizes.height);
    const cssEl = document.getElementById("css-renderer")!;
    cssEl.appendChild(this.css3d.domElement);
    // keep pointer-events off the container — individual iframes opt in via MonitorScreen
    (this.css3d.domElement as HTMLElement).style.pointerEvents = "none";

    sizes.onChange(() => this.onResize());
  }

  render(
    scene: THREE.Scene,
    cssScene: THREE.Scene,
    camera: THREE.PerspectiveCamera
  ) {
    this.webgl.render(scene, camera);
    this.css3d.render(cssScene, camera);
  }

  private onResize() {
    this.webgl.setSize(this.sizes.width, this.sizes.height);
    this.webgl.setPixelRatio(this.sizes.pixelRatio);
    this.css3d.setSize(this.sizes.width, this.sizes.height);
  }
}
