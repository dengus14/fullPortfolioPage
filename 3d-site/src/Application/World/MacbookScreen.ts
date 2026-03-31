import * as THREE from "three";

// vs code dark+ colour palette — deepened for better contrast on 3D surface
const C = {
  bg:          "#0d1117",
  lineNum:     "#6e7681",
  keyword:     "#569cd6",
  type:        "#4ec9b0",
  string:      "#ce9178",
  comment:     "#6a9955",
  fn:          "#dcdcaa",
  plain:       "#d4d4d4",
  number:      "#b5cea8",
  tabActive:   "#0d1117",
  tabInactive: "#161b22",
  tabTextOn:   "#ffffff",
  tabTextOff:  "#8b949e",
  titleBar:    "#1c1f24",
  statusBar:   "#007acc",
  statusText:  "#ffffff",
  explorerBg:  "#161b22",
  explorerTxt: "#c9d1d9",
  explorerSel: "#0d419d",
  gutterBdr:   "#21262d",
  activeLine:  "#161b22",
  cursor:      "#aeafad",
};

type Token = { t: string; c: string };
type Line  = Token[];

const CODE: Line[] = [
  [{ t: "import", c: C.keyword }, { t: " * as ", c: C.plain }, { t: "THREE", c: C.type }, { t: " from ", c: C.plain }, { t: '"three"', c: C.string }, { t: ";", c: C.plain }],
  [{ t: "import", c: C.keyword }, { t: " { ", c: C.plain }, { t: "GLTFLoader", c: C.type }, { t: " } from ", c: C.plain }, { t: '"three/examples/jsm/loaders/GLTFLoader.js"', c: C.string }, { t: ";", c: C.plain }],
  [{ t: "import", c: C.keyword }, { t: " { ", c: C.plain }, { t: "MonitorScreen", c: C.type }, { t: " } from ", c: C.plain }, { t: '"./MonitorScreen"', c: C.string }, { t: ";", c: C.plain }],
  [],
  [{ t: "export", c: C.keyword }, { t: " class ", c: C.keyword }, { t: "World", c: C.type }, { t: " {", c: C.plain }],
  [{ t: "  ", c: C.plain }, { t: "scene", c: C.plain }, { t: ": ", c: C.plain }, { t: "THREE", c: C.type }, { t: ".Scene;", c: C.plain }],
  [{ t: "  ", c: C.plain }, { t: "monitors", c: C.plain }, { t: ": ", c: C.plain }, { t: "MonitorScreen", c: C.type }, { t: "[] = [];", c: C.plain }],
  [],
  [{ t: "  ", c: C.plain }, { t: "constructor", c: C.fn }, { t: "(onProgress?: (p: ", c: C.plain }, { t: "number", c: C.type }, { t: ") => ", c: C.plain }, { t: "void", c: C.keyword }, { t: ") {", c: C.plain }],
  [{ t: "    ", c: C.plain }, { t: "this", c: C.keyword }, { t: ".scene = ", c: C.plain }, { t: "new", c: C.keyword }, { t: " THREE", c: C.type }, { t: ".Scene();", c: C.plain }],
  [{ t: "    ", c: C.plain }, { t: "this", c: C.keyword }, { t: ".", c: C.plain }, { t: "setupLighting", c: C.fn }, { t: "();", c: C.plain }],
  [{ t: "    ", c: C.plain }, { t: "this", c: C.keyword }, { t: ".", c: C.plain }, { t: "loadModel", c: C.fn }, { t: "(onProgress);", c: C.plain }],
  [{ t: "    ", c: C.plain }, { t: "this", c: C.keyword }, { t: ".", c: C.plain }, { t: "setupMonitors", c: C.fn }, { t: "();", c: C.plain }],
  [{ t: "  }", c: C.plain }],
  [],
  [{ t: "  ", c: C.plain }, { t: "private", c: C.keyword }, { t: " ", c: C.plain }, { t: "loadModel", c: C.fn }, { t: "(onProgress?: (p: ", c: C.plain }, { t: "number", c: C.type }, { t: ") => ", c: C.plain }, { t: "void", c: C.keyword }, { t: ") {", c: C.plain }],
  [{ t: "    ", c: C.plain }, { t: "const", c: C.keyword }, { t: " loader = ", c: C.plain }, { t: "new", c: C.keyword }, { t: " GLTFLoader();", c: C.type }],
  [{ t: "    ", c: C.plain }, { t: "// hide screen mesh — css3d iframe overlays it", c: C.comment }],
  [{ t: "    ", c: C.plain }, { t: "loader.", c: C.plain }, { t: "load", c: C.fn }, { t: '("/gaming_scene.glb", gltf => {', c: C.plain }],
  [{ t: "      ", c: C.plain }, { t: "gltf.scene.", c: C.plain }, { t: "traverse", c: C.fn }, { t: "(child => {", c: C.plain }],
  [{ t: "        ", c: C.plain }, { t: "if", c: C.keyword }, { t: " (child.name === ", c: C.plain }, { t: '"monitor_screen"', c: C.string }, { t: ")", c: C.plain }],
  [{ t: "          ", c: C.plain }, { t: "(child as Mesh).visible = ", c: C.plain }, { t: "false", c: C.keyword }, { t: ";", c: C.plain }],
  [{ t: "      }", c: C.plain }, { t: ");", c: C.plain }],
  [{ t: "    }", c: C.plain }, { t: ");", c: C.plain }],
  [{ t: "  }", c: C.plain }],
  [{ t: "}", c: C.plain }],
];

export function buildVSCodeTexture(W: number, H: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Scale all pixel constants by canvas DPR so the layout is identical at any resolution
  const DPR      = W / 1640;
  const FONT_SIZE  = Math.round(13 * DPR);
  const LINE_H     = Math.round(20 * DPR);
  const GUTTER_W   = Math.round(48 * DPR);
  const TAB_H      = Math.round(32 * DPR);
  const STATUS_H   = Math.round(22 * DPR);
  const SIDEBAR_W  = Math.round(160 * DPR);
  const TITLE_H    = Math.round(28 * DPR);
  const EDITOR_TOP = TITLE_H + TAB_H;
  const EDITOR_LEFT = SIDEBAR_W + GUTTER_W;
  const EDITOR_H   = H - EDITOR_TOP - STATUS_H;
  const ACTIVE_LINE = 8;

  ctx.font = `${FONT_SIZE}px Consolas, "Courier New", monospace`;

  // title bar
  ctx.fillStyle = C.titleBar;
  ctx.fillRect(0, 0, W, TITLE_H);
  ([ ["#ff5f57", 12], ["#febc2e", 30], ["#28c840", 48] ] as [string, number][]).forEach(([col, x]) => {
    ctx.beginPath(); ctx.arc(x * DPR, TITLE_H / 2, 5.5 * DPR, 0, Math.PI * 2);
    ctx.fillStyle = col; ctx.fill();
  });
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `${Math.round(11 * DPR)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("World.ts — 3d-site / src / Application / World", W / 2, TITLE_H - 8);
  ctx.textAlign = "left";

  // sidebar
  ctx.fillStyle = C.explorerBg;
  ctx.fillRect(0, TITLE_H, SIDEBAR_W, H - TITLE_H);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = `${Math.round(10 * DPR)}px system-ui, sans-serif`;
  ctx.fillText("EXPLORER", 10 * DPR, TITLE_H + 18 * DPR);

  const FILES = [
    ["Application.ts", false],
    ["Renderer.ts",    false],
    ["▾ Camera",       false],
    ["  Camera.ts",    false],
    ["▾ World",        false],
    ["  World.ts",     true ],
    ["  MonitorScreen.ts", false],
    ["  MacbookScreen.ts", false],
    ["▾ Utils",        false],
    ["  Sizes.ts",     false],
    ["  Time.ts",      false],
    ["  Mouse.ts",     false],
  ] as [string, boolean][];

  FILES.forEach(([name, active], i) => {
    const fy = TITLE_H + 30 * DPR + i * 19 * DPR;
    if (active) {
      ctx.fillStyle = C.explorerSel;
      ctx.fillRect(0, fy - 13 * DPR, SIDEBAR_W, 19 * DPR);
    }
    ctx.fillStyle = active ? "#fff" : C.explorerTxt;
    ctx.font = `${FONT_SIZE - Math.round(DPR)}px Consolas, monospace`;
    ctx.fillText(name, 10 * DPR, fy);
  });

  // tabs
  ctx.fillStyle = C.tabInactive;
  ctx.fillRect(SIDEBAR_W, TITLE_H, W - SIDEBAR_W, TAB_H);
  ctx.fillStyle = C.tabActive;
  ctx.fillRect(SIDEBAR_W, TITLE_H, 130 * DPR, TAB_H);
  ctx.fillStyle = C.statusBar;
  ctx.fillRect(SIDEBAR_W, TITLE_H, 130 * DPR, 2 * DPR);
  ctx.fillStyle = C.tabTextOn;
  ctx.font = `${FONT_SIZE - Math.round(DPR)}px system-ui, sans-serif`;
  ctx.fillText("World.ts", SIDEBAR_W + 10 * DPR, TITLE_H + 21 * DPR);
  ctx.fillStyle = C.tabTextOff;
  ctx.fillText("Application.ts", SIDEBAR_W + 144 * DPR, TITLE_H + 21 * DPR);

  // editor background
  ctx.fillStyle = C.bg;
  ctx.fillRect(SIDEBAR_W, EDITOR_TOP, W - SIDEBAR_W, EDITOR_H);
  ctx.fillStyle = C.activeLine;
  ctx.fillRect(SIDEBAR_W, EDITOR_TOP + ACTIVE_LINE * LINE_H, W - SIDEBAR_W, LINE_H);

  // gutter
  ctx.fillStyle = C.bg;
  ctx.fillRect(SIDEBAR_W, EDITOR_TOP, GUTTER_W, EDITOR_H);
  ctx.strokeStyle = C.gutterBdr;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(SIDEBAR_W + GUTTER_W, EDITOR_TOP);
  ctx.lineTo(SIDEBAR_W + GUTTER_W, EDITOR_TOP + EDITOR_H);
  ctx.stroke();

  // cursor
  ctx.fillStyle = C.cursor;
  ctx.fillRect(EDITOR_LEFT + 4 * DPR, EDITOR_TOP + ACTIVE_LINE * LINE_H + 3 * DPR, 2 * DPR, LINE_H - 6 * DPR);

  // code lines
  ctx.font = `${FONT_SIZE}px Consolas, "Courier New", monospace`;
  const visible = Math.floor(EDITOR_H / LINE_H);

  CODE.slice(0, visible).forEach((tokens, i) => {
    const y = EDITOR_TOP + i * LINE_H + LINE_H - 4;

    ctx.fillStyle = i === ACTIVE_LINE ? "#c6c6c6" : C.lineNum;
    ctx.textAlign = "right";
    ctx.fillText(String(i + 1), SIDEBAR_W + GUTTER_W - 6 * DPR, y);
    ctx.textAlign = "left";

    let x = EDITOR_LEFT + 8 * DPR;
    tokens.forEach(({ t, c }) => {
      ctx.fillStyle = c;
      ctx.fillText(t, x, y);
      x += ctx.measureText(t).width;
    });
  });

  // status bar
  ctx.fillStyle = C.statusBar;
  ctx.fillRect(0, H - STATUS_H, W, STATUS_H);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, H - STATUS_H, 100 * DPR, STATUS_H);
  ctx.fillStyle = C.statusText;
  ctx.font = `${Math.round(10 * DPR)}px system-ui, sans-serif`;
  ctx.fillText(" ⎇  main", 4 * DPR, H - 6 * DPR);
  ctx.fillText(
    `TypeScript   Ln ${ACTIVE_LINE + 1}, Col 5   UTF-8   LF`,
    SIDEBAR_W + 10 * DPR, H - 6 * DPR
  );

  return new THREE.CanvasTexture(canvas);
}
