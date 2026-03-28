import * as THREE from "three";

// vs code dark+ colour palette
const C = {
  bg:          "#1e1e1e",
  lineNum:     "#858585",
  keyword:     "#569cd6",
  type:        "#4ec9b0",
  string:      "#ce9178",
  comment:     "#6a9955",
  fn:          "#dcdcaa",
  plain:       "#d4d4d4",
  number:      "#b5cea8",
  tabActive:   "#1e1e1e",
  tabInactive: "#2d2d2d",
  tabTextOn:   "#ffffff",
  tabTextOff:  "#969696",
  titleBar:    "#323233",
  statusBar:   "#007acc",
  statusText:  "#ffffff",
  explorerBg:  "#252526",
  explorerTxt: "#cccccc",
  explorerSel: "#094771",
  gutterBdr:   "#333333",
  activeLine:  "#2a2d2e",
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

  const FONT_SIZE  = 13;
  const LINE_H     = 20;
  const GUTTER_W   = 48;
  const TAB_H      = 32;
  const STATUS_H   = 22;
  const SIDEBAR_W  = 160;
  const TITLE_H    = 28;
  const EDITOR_TOP = TITLE_H + TAB_H;
  const EDITOR_LEFT = SIDEBAR_W + GUTTER_W;
  const EDITOR_H   = H - EDITOR_TOP - STATUS_H;
  const ACTIVE_LINE = 8;

  ctx.font = `${FONT_SIZE}px Consolas, "Courier New", monospace`;

  // title bar
  ctx.fillStyle = C.titleBar;
  ctx.fillRect(0, 0, W, TITLE_H);
  ([ ["#ff5f57", 12], ["#febc2e", 30], ["#28c840", 48] ] as [string, number][]).forEach(([col, x]) => {
    ctx.beginPath(); ctx.arc(x, TITLE_H / 2, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = col; ctx.fill();
  });
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `11px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("World.ts — 3d-site / src / Application / World", W / 2, TITLE_H - 8);
  ctx.textAlign = "left";

  // sidebar
  ctx.fillStyle = C.explorerBg;
  ctx.fillRect(0, TITLE_H, SIDEBAR_W, H - TITLE_H);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = `10px system-ui, sans-serif`;
  ctx.fillText("EXPLORER", 10, TITLE_H + 18);

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
    const fy = TITLE_H + 30 + i * 19;
    if (active) {
      ctx.fillStyle = C.explorerSel;
      ctx.fillRect(0, fy - 13, SIDEBAR_W, 19);
    }
    ctx.fillStyle = active ? "#fff" : C.explorerTxt;
    ctx.font = `${FONT_SIZE - 1}px Consolas, monospace`;
    ctx.fillText(name, 10, fy);
  });

  // tabs
  ctx.fillStyle = C.tabInactive;
  ctx.fillRect(SIDEBAR_W, TITLE_H, W - SIDEBAR_W, TAB_H);
  ctx.fillStyle = C.tabActive;
  ctx.fillRect(SIDEBAR_W, TITLE_H, 130, TAB_H);
  ctx.fillStyle = C.statusBar;
  ctx.fillRect(SIDEBAR_W, TITLE_H, 130, 2);
  ctx.fillStyle = C.tabTextOn;
  ctx.font = `${FONT_SIZE - 1}px system-ui, sans-serif`;
  ctx.fillText("World.ts", SIDEBAR_W + 10, TITLE_H + 21);
  ctx.fillStyle = C.tabTextOff;
  ctx.fillText("Application.ts", SIDEBAR_W + 144, TITLE_H + 21);

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
  ctx.fillRect(EDITOR_LEFT + 4, EDITOR_TOP + ACTIVE_LINE * LINE_H + 3, 2, LINE_H - 6);

  // code lines
  ctx.font = `${FONT_SIZE}px Consolas, "Courier New", monospace`;
  const visible = Math.floor(EDITOR_H / LINE_H);

  CODE.slice(0, visible).forEach((tokens, i) => {
    const y = EDITOR_TOP + i * LINE_H + LINE_H - 4;

    ctx.fillStyle = i === ACTIVE_LINE ? "#c6c6c6" : C.lineNum;
    ctx.textAlign = "right";
    ctx.fillText(String(i + 1), SIDEBAR_W + GUTTER_W - 6, y);
    ctx.textAlign = "left";

    let x = EDITOR_LEFT + 8;
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
  ctx.fillRect(0, H - STATUS_H, 100, STATUS_H);
  ctx.fillStyle = C.statusText;
  ctx.font = `10px system-ui, sans-serif`;
  ctx.fillText(" ⎇  main", 4, H - 6);
  ctx.fillText(
    `TypeScript   Ln ${ACTIVE_LINE + 1}, Col 5   UTF-8   LF`,
    SIDEBAR_W + 10, H - 6
  );

  return new THREE.CanvasTexture(canvas);
}
