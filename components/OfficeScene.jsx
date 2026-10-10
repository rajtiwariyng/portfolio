"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ---------- Layout of the office (world units, x = right, z = toward camera) ---------- */
const FLOOR = { x1: -17, x2: 17, z1: -15.5, z2: 9.5 };

export const ROOM_ZONES = {
  tools: { x1: -12, x2: -5, z1: -10.5, z2: -3.5, label: "Tool Shop", sign: [-8.5, -10] },
  work: { x1: 3.6, x2: 14, z1: -11, z2: -3.2, label: "Work Studio", sign: [8.5, -11] },
  blog: { x1: 7.5, x2: 15, z1: 0.5, z2: 7.5, label: "Newsroom", sign: [11.2, 0.6] },
  games: { x1: -15, x2: -7.5, z1: 0.5, z2: 7.5, label: "Game Room", sign: [-11.2, 0.6] },
  cabin: { x1: -3, x2: 3, z1: -15.5, z2: -11, label: "Raj's Cabin", sign: [0, -11.4] },
};

// Waypoints from the lobby into each room; the last point is "inside".
const ROUTES = {
  tools: [[-3.4, 1.4], [-3.6, -6.8], [-7.5, -6.8]],
  work: [[3, 1.2], [3, -3], [8.5, -3.6]],
  blog: [[4.5, 2.6], [10.5, 3.2]],
  games: [[-4.5, 2.6], [-10.5, 3.6]],
  cabin: [[3, 1.2], [3, -9.6], [0, -10.2], [0, -12.8]],
};

const PLAYER_START = [0, 2.2];
const SPEED = 4.6;

/* ---------- small helpers ---------- */
const matCache = new Map();
function mat(color, extra) {
  const key = color + (extra ? JSON.stringify(extra) : "");
  if (!matCache.has(key)) {
    matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.85, flatShading: true, ...extra }));
  }
  return matCache.get(key);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function textTexture(text, { font = "600 64px Georgia, serif", fg = "#2a2622", bg = "#ffffff", pad = 34, radius = 40, height = 120 } = {}) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width + pad * 2);
  c.width = w;
  c.height = height;
  if (bg) {
    ctx.fillStyle = bg;
    roundRect(ctx, 0, 0, w, height, radius);
    ctx.fill();
  }
  ctx.font = font;
  ctx.fillStyle = fg;
  ctx.textBaseline = "middle";
  ctx.fillText(text, pad, height / 2 + 4);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: w / height };
}

function codeTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 80;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#1f2430";
  ctx.fillRect(0, 0, 128, 80);
  const colors = ["#8fd3a6", "#f5c26b", "#9fc4ff", "#e79ac4", "#d7dae0"];
  for (let i = 0; i < 8; i++) {
    let x = 8 + (i % 3) * 8;
    const y = 8 + i * 8.5;
    const n = 2 + ((i * 7) % 3);
    for (let j = 0; j < n; j++) {
      const len = 10 + ((i * 13 + j * 17) % 30);
      ctx.fillStyle = colors[(i + j) % colors.length];
      ctx.fillRect(x, y, len, 4);
      x += len + 5;
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ---------- component ---------- */
export default function OfficeScene({ apiRef, onZoneChange, onArrive, onCancel, onDepart }) {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const cbRef = useRef({ onZoneChange, onArrive, onCancel, onDepart });
  cbRef.current = { onZoneChange, onArrive, onCancel, onDepart };

  useEffect(() => {
    const mount = mountRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fffdf0");

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
    const camOffset = new THREE.Vector3(0, 24, 19);
    const camTarget = new THREE.Vector3(0, 0, -2);

    /* lights */
    scene.add(new THREE.HemisphereLight("#ffffff", "#d9ccb3", 1.5));
    const sun = new THREE.DirectionalLight("#fff6e6", 1.6);
    sun.position.set(9, 22, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 70 });
    sun.shadow.bias = -0.0006;
    sun.shadow.radius = 4;
    scene.add(sun);

    const obstacles = [];
    const block = (cx, cz, w, d, pad = 0.05) =>
      obstacles.push({ x1: cx - w / 2 - pad, x2: cx + w / 2 + pad, z1: cz - d / 2 - pad, z2: cz + d / 2 + pad });

    function box(w, h, d, color, x, y, z, { cast = true, receive = true, material, parent = scene } = {}) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material || mat(color));
      m.position.set(x, y + h / 2, z);
      m.castShadow = cast;
      m.receiveShadow = receive;
      parent.add(m);
      return m;
    }

    /* floor & zones */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(FLOOR.x2 - FLOOR.x1 + 8, FLOOR.z2 - FLOOR.z1 + 8),
      mat("#fffef7")
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, (FLOOR.z1 + FLOOR.z2) / 2);
    floor.receiveShadow = true;
    scene.add(floor);

    const tints = { tools: "#f0f8ee", work: "#fff6e2", blog: "#f0f5fd", games: "#fdf0f2", cabin: "#f5e9d8" };
    for (const [id, z] of Object.entries(ROOM_ZONES)) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(z.x2 - z.x1, z.z2 - z.z1), mat(tints[id]));
      p.rotation.x = -Math.PI / 2;
      p.position.set((z.x1 + z.x2) / 2, 0.01, (z.z1 + z.z2) / 2);
      p.receiveShadow = true;
      scene.add(p);
    }

    /* walls */
    box(44, 3.2, 0.5, "#f1e8d6", 0, 0, -16.2);
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      box(3.6, 1.6, 0.05, "", i * 5.5, 1, -15.92, { material: mat("#dcecf2", { roughness: 0.3 }), cast: false });
    }
    // front wall with signage
    box(44, 1.3, 0.8, "#efe2cd", 0, 0, 10.4);
    box(44, 0.12, 1.0, "#fbf3e6", 0, 1.3, 10.4);
    const banner = textTexture("RAJ'S OFFICE", { font: "italic 900 92px Arial Black, Arial, sans-serif", fg: "#ffffff", bg: "#2f6b4a", radius: 0, pad: 70, height: 140 });
    const bannerMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.1 * banner.aspect, 1.1), new THREE.MeshBasicMaterial({ map: banner.tex }));
    bannerMesh.position.set(9.5, 0.68, 10.82);
    scene.add(bannerMesh);
    const plaque = textTexture("RajDevHub", { font: "800 80px Arial, sans-serif", fg: "#2f6b4a", bg: "#ffffff", radius: 18, pad: 40, height: 130 });
    const plaqueMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.95 * plaque.aspect, 0.95), new THREE.MeshBasicMaterial({ map: plaque.tex }));
    plaqueMesh.position.set(-10, 0.68, 10.82);
    scene.add(plaqueMesh);

    /* shared textures */
    const screenTex = codeTexture();
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });

    /* furniture builders */
    function chair(x, z, color, rotY = 0) {
      const g = new THREE.Group();
      box(0.62, 0.1, 0.62, color, 0, 0.5, 0, { parent: g });
      box(0.62, 0.62, 0.1, color, 0, 0.6, 0.28, { parent: g });
      box(0.08, 0.5, 0.08, "#33373d", 0, 0, 0, { parent: g });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.06, 10), mat("#33373d"));
      base.position.y = 0.03;
      g.add(base);
      g.position.set(x, 0, z);
      g.rotation.y = rotY;
      scene.add(g);
    }

    function desk(x, z, { monitor = true, chairColor = null, w = 2.1 } = {}) {
      box(w, 0.12, 1.1, "#f2c48f", x, 0.75, z);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.09, 0.75, 0.09, "#c98d57", x + sx * (w / 2 - 0.1), 0, z + sz * 0.45);
      if (monitor) {
        box(0.08, 0.3, 0.08, "#33373d", x, 0.87, z - 0.25);
        box(0.95, 0.58, 0.07, "#2b2f36", x, 1.12, z - 0.25);
        const s = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.48), screenMat);
        s.position.set(x, 1.41, z - 0.21);
        scene.add(s);
      }
      if (chairColor) chair(x, z + 0.95, chairColor);
      block(x, z, w, 1.1);
    }

    function plant(x, z, s = 1, pot = "#e39a6e") {
      const g = new THREE.Group();
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.32, 0.7, 8), mat(pot));
      p.position.y = 0.35;
      p.castShadow = true;
      g.add(p);
      const leaves = [
        [0, 1.15, 0, 0.55, "#6fa65e"],
        [0.3, 1.45, 0.1, 0.45, "#7db66b"],
        [-0.25, 1.5, -0.1, 0.42, "#64995a"],
        [0.05, 1.8, 0, 0.36, "#82bb70"],
      ];
      for (const [lx, ly, lz, r, c] of leaves) {
        const l = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), mat(c));
        l.position.set(lx, ly, lz);
        l.rotation.set(lx * 3, ly, lz * 2);
        l.castShadow = true;
        g.add(l);
      }
      g.position.set(x, 0, z);
      g.scale.setScalar(s);
      scene.add(g);
      block(x, z, 0.8 * s, 0.8 * s);
    }

    /* people */
    function person({ shirt, pants = "#2c3e66", skin = "#f0c39e", hair = "#3b2618", hairLong = false }) {
      const g = new THREE.Group();
      const legs = [];
      const arms = [];
      for (const sx of [-1, 1]) {
        const pivot = new THREE.Group();
        pivot.position.set(sx * 0.17, 0.92, 0);
        box(0.24, 0.84, 0.28, pants, 0, -0.84, 0, { parent: pivot });
        box(0.26, 0.12, 0.38, "#3a5fa6", 0, -0.92, 0.05, { parent: pivot });
        g.add(pivot);
        legs.push(pivot);
      }
      box(0.72, 0.82, 0.4, shirt, 0, 0.9, 0, { parent: g });
      for (const sx of [-1, 1]) {
        const pivot = new THREE.Group();
        pivot.position.set(sx * 0.47, 1.66, 0);
        box(0.2, 0.62, 0.22, shirt, 0, -0.62, 0, { parent: pivot });
        box(0.18, 0.16, 0.2, skin, 0, -0.78, 0, { parent: pivot });
        g.add(pivot);
        arms.push(pivot);
      }
      box(0.22, 0.14, 0.22, skin, 0, 1.72, 0, { parent: g });
      const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.33, 1), mat(skin));
      head.position.y = 2.13;
      head.castShadow = true;
      g.add(head);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.36, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2.1), mat(hair));
      cap.position.y = 2.17;
      cap.rotation.x = -0.25;
      cap.castShadow = true;
      g.add(cap);
      if (hairLong) box(0.6, 0.55, 0.18, hair, 0, 1.75, -0.2, { parent: g });
      for (const sx of [-1, 1]) box(0.06, 0.08, 0.04, "#2a2622", sx * 0.12, 2.12, 0.3, { parent: g, cast: false });
      return { g, legs, arms, head };
    }

    function seated(x, z, opts, rotY = Math.PI) {
      const p = person(opts);
      p.legs.forEach((l) => (l.rotation.x = -Math.PI / 2.2));
      p.arms.forEach((a) => (a.rotation.x = -0.9));
      p.g.position.set(x, -0.35, z);
      p.g.rotation.y = rotY;
      scene.add(p.g);
      return p;
    }

    /* ---- Reception ---- */
    box(4.4, 1.05, 1.2, "#d6a77a", 0, 0, -1.1);
    box(4.9, 0.12, 1.6, "#ffffff", 0, 1.05, -1.2);
    block(0, -1.15, 4.9, 1.6);
    const rec = textTexture("RECEPTION", { font: "800 70px Arial, sans-serif", fg: "#2f6b4a", bg: "#e4f0e3", radius: 6, pad: 40, height: 110 });
    const recMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5 * rec.aspect, 0.5), new THREE.MeshBasicMaterial({ map: rec.tex }));
    recMesh.position.set(0, 0.55, -0.48);
    scene.add(recMesh);
    box(0.08, 0.25, 0.08, "#33373d", 1.2, 1.17, -1.5);
    box(0.85, 0.5, 0.06, "#2b2f36", 1.2, 1.4, -1.5);
    {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.42), screenMat);
      s.position.set(1.2, 1.65, -1.46);
      scene.add(s);
    }
    const receptionist = person({ shirt: "#d9534f", pants: "#4a3a6b", hair: "#e3c16f", hairLong: true });
    receptionist.g.position.set(-0.4, 0, -2.4);
    scene.add(receptionist.g);
    block(-0.4, -2.4, 0.8, 0.6);

    /* ---- Tool Shop: glass room with shelves ---- */
    {
      const z = ROOM_ZONES.tools;
      const glass = mat("#cfe9db", { transparent: true, opacity: 0.28, roughness: 0.1 });
      const frame = "#3d4a42";
      const H = 2.4;
      const wall = (x1, z1, x2, z2) => {
        const len = Math.hypot(x2 - x1, z2 - z1);
        const m = new THREE.Mesh(new THREE.BoxGeometry(x1 === x2 ? 0.06 : len, H, x1 === x2 ? len : 0.06), glass);
        m.position.set((x1 + x2) / 2, H / 2, (z1 + z2) / 2);
        scene.add(m);
        box(x1 === x2 ? 0.14 : len + 0.14, 0.12, x1 === x2 ? len + 0.14 : 0.14, frame, (x1 + x2) / 2, H, (z1 + z2) / 2);
        block((x1 + x2) / 2, (z1 + z2) / 2, x1 === x2 ? 0.2 : len, x1 === x2 ? len : 0.2);
      };
      wall(z.x1, z.z1, z.x2, z.z1); // back
      wall(z.x1, z.z1, z.x1, z.z2); // left
      wall(z.x1, z.z2, z.x2, z.z2); // front
      wall(z.x2, z.z1, z.x2, -7.6); // right, with door gap
      wall(z.x2, -6, z.x2, z.z2);
      for (const [px, pz] of [[z.x1, z.z1], [z.x2, z.z1], [z.x1, z.z2], [z.x2, z.z2], [z.x2, -7.6], [z.x2, -6]]) box(0.14, H, 0.14, frame, px, 0, pz);
      // shelves on back wall
      const cubeColors = ["#c99ad6", "#f2d36b", "#8fb5e0", "#8cc49a", "#f2a07b", "#e6e1d6"];
      for (let s = 0; s < 2; s++) {
        const sx = -10.3 + s * 3.2;
        box(2.8, 2.1, 0.08, "#b97f4f", sx, 0, z.z1 + 0.35);
        for (let lvl = 0; lvl < 3; lvl++) {
          box(2.8, 0.08, 0.6, "#c98d57", sx, 0.3 + lvl * 0.65, z.z1 + 0.6);
          for (let k = 0; k < 4; k++) {
            const c = cubeColors[(s * 5 + lvl * 3 + k) % cubeColors.length];
            box(0.42, 0.42, 0.42, c, sx - 1.05 + k * 0.7, 0.38 + lvl * 0.65, z.z1 + 0.6);
          }
        }
        block(sx, z.z1 + 0.55, 2.8, 0.7);
      }
      // counter
      box(2.6, 0.9, 1.0, "#c7a07a", -9.4, 0, -5.6);
      box(2.8, 0.08, 1.15, "#f6efe3", -9.4, 0.9, -5.6);
      block(-9.4, -5.6, 2.8, 1.15);
      box(0.4, 0.3, 0.4, "#f2d36b", -10.2, 0.98, -5.6);
      box(0.4, 0.3, 0.4, "#8cc49a", -9.6, 0.98, -5.5);
      seated(-9.4, -4.5, { shirt: "#5a9b74", hair: "#2a1a12" }, Math.PI).g.position.y = -0.35;
    }

    /* ---- Work Studio ---- */
    const workers = [];
    {
      const chairColors = ["#e8916a", "#8db592", "#e8916a"];
      const people = [
        { shirt: "#c9443f", hair: "#d8b25c", hairLong: true },
        { shirt: "#5b8bd0", hair: "#2a1a12" },
        null,
        { shirt: "#a678c9", hair: "#3b2618" },
        null,
        { shirt: "#e0a43b", hair: "#1e1410" },
      ];
      let i = 0;
      for (const row of [-9.3, -6.2]) {
        for (const col of [5.6, 8.6, 11.6]) {
          desk(col, row, { chairColor: chairColors[i % 3] });
          if (people[i]) workers.push(seated(col, row + 0.95, people[i], Math.PI));
          i++;
        }
      }
    }

    /* ---- Newsroom ---- */
    {
      box(0.15, 1.8, 0.15, "#33373d", 11.2, 0, 1.4);
      box(3.2, 1.7, 0.12, "#2b2f36", 11.2, 1.3, 1.4);
      const news = textTexture("TODAY IN TECH", { font: "800 60px Arial, sans-serif", fg: "#ffffff", bg: "#2f6b4a", radius: 0, pad: 40, height: 110 });
      const nm = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 2.9 / news.aspect), new THREE.MeshBasicMaterial({ map: news.tex }));
      nm.position.set(11.2, 2.45, 1.47);
      scene.add(nm);
      const ticker = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 0.9), screenMat);
      ticker.position.set(11.2, 1.75, 1.47);
      scene.add(ticker);
      block(11.2, 1.4, 3.2, 0.4);
      // long table with papers
      box(4.6, 0.12, 1.4, "#f2c48f", 11.2, 0.75, 4.4);
      for (const sx of [-2.1, 2.1]) for (const sz of [-0.55, 0.55]) box(0.1, 0.75, 0.1, "#c98d57", 11.2 + sx, 0, 4.4 + sz);
      block(11.2, 4.4, 4.6, 1.4);
      for (let k = 0; k < 4; k++) box(0.55, 0.03 + k * 0.01, 0.75, "#fbfaf6", 9.6 + k * 1.05, 0.87, 4.3 + (k % 2) * 0.2);
      chair(9.8, 5.6, "#8db592");
      chair(12.6, 5.6, "#e8916a");
      seated(9.8, 5.6, { shirt: "#3f8f8a", hair: "#3b2618" }, Math.PI);
    }

    /* ---- Game Room ---- */
    const arcadeColors = ["#d9534f", "#5b8bd0", "#e0a43b"];
    arcadeColors.forEach((c, k) => {
      const x = -13.6 + k * 1.7;
      box(1.2, 2.1, 1.0, c, x, 0, 1.4);
      box(1.25, 0.3, 1.05, "#2b2f36", x, 2.1, 1.4);
      box(1.0, 0.18, 0.5, "#2b2f36", x, 1.05, 2.0);
      const s = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.65), screenMat);
      s.position.set(x, 1.65, 1.91);
      scene.add(s);
      block(x, 1.6, 1.25, 1.3);
    });
    {
      box(3.0, 0.1, 1.7, "#2f7a54", -11.0, 0.8, 4.9);
      box(0.04, 0.02, 1.7, "#ffffff", -11.0, 0.9, 4.9, { cast: false });
      box(0.06, 0.18, 1.8, "#f5f5f0", -11.0, 0.9, 4.9);
      for (const sx of [-1.3, 1.3]) for (const sz of [-0.7, 0.7]) box(0.1, 0.8, 0.1, "#33373d", -11.0 + sx, 0, 4.9 + sz);
      block(-11.0, 4.9, 3.0, 1.8);
      const bag = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 1), mat("#e8916a"));
      bag.scale.set(1, 0.6, 1);
      bag.position.set(-8.4, 0.35, 6.4);
      bag.castShadow = true;
      scene.add(bag);
      block(-8.4, 6.4, 1.1, 1.1);
    }

    /* ---- Cabin ---- */
    {
      const z = ROOM_ZONES.cabin;
      const wood = "#c99a6b";
      box(0.25, 1.6, z.z2 - z.z1, wood, z.x1, 0, (z.z1 + z.z2) / 2);
      box(0.25, 1.6, z.z2 - z.z1, wood, z.x2, 0, (z.z1 + z.z2) / 2);
      box(2.2, 1.6, 0.25, wood, -1.9, 0, z.z2);
      box(2.2, 1.6, 0.25, wood, 1.9, 0, z.z2);
      block(z.x1, (z.z1 + z.z2) / 2, 0.3, z.z2 - z.z1);
      block(z.x2, (z.z1 + z.z2) / 2, 0.3, z.z2 - z.z1);
      block(-1.9, z.z2, 2.2, 0.3);
      block(1.9, z.z2, 2.2, 0.3);
      desk(-1.2, -14.4, { w: 1.8 });
      chair(-1.2, -13.5, "#2f6b4a");
      box(1.4, 2.0, 0.5, "#a8774a", 1.9, 0, -15.0);
      for (let k = 0; k < 3; k++) box(1.2, 0.35, 0.35, ["#d9534f", "#5b8bd0", "#8cc49a"][k], 1.9, 0.25 + k * 0.6, -14.85);
      block(1.9, -15.0, 1.4, 0.5);
      plant(2.3, -12.2, 0.7, "#f2efe8");
    }

    /* ---- plants around the lobby ---- */
    plant(-4.6, -1.5, 1.0, "#f2efe8");
    plant(-4.9, -2.7, 0.9, "#f2efe8");
    plant(5.6, 7.6, 1.5);
    plant(-15.5, 8.2, 1.2);
    plant(15.6, -1.4, 1.1, "#f2efe8");
    plant(-15.6, -12.8, 1.2);
    plant(15.6, -13.2, 1.3);
    plant(-5.8, 8.4, 0.9, "#f2efe8");

    /* ---- floating room signs (clickable) ---- */
    const signs = [];
    for (const [id, z] of Object.entries(ROOM_ZONES)) {
      const t = textTexture(z.label, { font: "600 58px Georgia, serif", fg: "#2a2622", bg: "rgba(255,255,255,0.95)", height: 104, radius: 52, pad: 38 });
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t.tex, depthTest: false }));
      const h = 0.62;
      sp.scale.set(h * t.aspect, h, 1);
      sp.position.set(z.sign[0], 3.5, z.sign[1]);
      sp.renderOrder = 10;
      sp.userData.room = id;
      sp.userData.baseY = 3.5;
      scene.add(sp);
      signs.push(sp);
    }

    /* ---- player ---- */
    const player = person({ shirt: "#3d7cc9", pants: "#1f2a3a", hair: "#2a1a12" });
    player.g.position.set(PLAYER_START[0], 0, PLAYER_START[1]);
    player.g.rotation.y = Math.PI;
    scene.add(player.g);

    // a colleague strolling across the lobby
    const stroller = person({ shirt: "#8db592", pants: "#3a3a3a", hair: "#7a4b2a", hairLong: true });
    stroller.g.position.set(-3, 0, 6.6);
    scene.add(stroller.g);

    // click marker
    const marker = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.38, 24), new THREE.MeshBasicMaterial({ color: "#2f6b4a", transparent: true, opacity: 0 }));
    marker.rotation.x = -Math.PI / 2;
    marker.position.y = 0.03;
    scene.add(marker);

    /* ---------- movement ---------- */
    let path = [];
    let targetRoom = null;
    let stuckTime = 0;
    let currentZone = null;
    const keys = new Set();

    const R = 0.32;
    const hits = (x, z) => {
      if (x < FLOOR.x1 || x > FLOOR.x2 || z < FLOOR.z1 || z > FLOOR.z2) return true;
      for (const o of obstacles) if (x + R > o.x1 && x - R < o.x2 && z + R > o.z1 && z - R < o.z2) return true;
      return false;
    };

    function tryMove(dx, dz) {
      const p = player.g.position;
      if (!hits(p.x + dx, p.z + dz)) { p.x += dx; p.z += dz; return true; }
      if (!hits(p.x + dx, p.z)) { p.x += dx; return true; }
      if (!hits(p.x, p.z + dz)) { p.z += dz; return true; }
      return false;
    }

    function zoneAt(x, z) {
      for (const [id, r] of Object.entries(ROOM_ZONES)) if (x > r.x1 && x < r.x2 && z > r.z1 && z < r.z2) return id;
      return null;
    }

    function walkToRoom(id) {
      if (!ROUTES[id]) return;
      const here = zoneAt(player.g.position.x, player.g.position.z);
      // leave the current room through its own route (reversed) before heading out
      const exit = here && here !== id ? [...ROUTES[here]].reverse().slice(1) : [];
      path = [...exit, ...ROUTES[id]].map(([x, z]) => new THREE.Vector2(x, z));
      targetRoom = id;
      stuckTime = 0;
      cbRef.current.onDepart?.(id);
    }

    function cancelRoom() {
      if (targetRoom) cbRef.current.onCancel?.();
      targetRoom = null;
    }

    function walkToPoint(x, z) {
      cancelRoom();
      path = [new THREE.Vector2(x, z)];
      targetRoom = null;
      stuckTime = 0;
      marker.position.x = x;
      marker.position.z = z;
      marker.material.opacity = 0.9;
    }

    if (apiRef) apiRef.current = { walkToRoom };

    /* ---------- input ---------- */
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const setNdc = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
    };
    let downAt = null;
    const onDown = (e) => (downAt = [e.clientX, e.clientY]);
    const onUp = (e) => {
      if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 8) return;
      setNdc(e);
      const s = raycaster.intersectObjects(signs)[0];
      if (s) return walkToRoom(s.object.userData.room);
      const f = raycaster.intersectObject(floor)[0];
      if (f) walkToPoint(f.point.x, f.point.z);
    };
    const onMove = (e) => {
      setNdc(e);
      renderer.domElement.style.cursor = raycaster.intersectObjects(signs).length ? "pointer" : "default";
    };
    const heroVisible = () => mount.getBoundingClientRect().bottom > window.innerHeight * 0.5;
    const KEYMAP = { w: [0, -1], arrowup: [0, -1], s: [0, 1], arrowdown: [0, 1], a: [-1, 0], arrowleft: [-1, 0], d: [1, 0], arrowright: [1, 0] };
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (!KEYMAP[k] || !heroVisible()) return;
      e.preventDefault();
      if (e.type === "keydown") {
        keys.add(k);
        path = [];
        cancelRoom();
      } else keys.delete(k);
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    const onBlur = () => keys.clear();
    window.addEventListener("blur", onBlur);

    /* ---------- sizing ---------- */
    let wide = true;
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      wide = w > 760;
      // zoom out on narrow / portrait screens so the office still fits
      const fit = camera.aspect < 1 ? 2.1 : camera.aspect < 1.4 ? 1.6 : 1.42;
      camOffset.set(0, 24 * fit, 19 * fit);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    /* ---------- loop ---------- */
    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;
    let walkPhase = 0;
    let strollDir = 1;
    const desiredTarget = new THREE.Vector3();

    function animatePerson(p, moving, dt, speed = 1) {
      if (moving) {
        p._phase = (p._phase || 0) + dt * 10 * speed;
        const s = Math.sin(p._phase) * 0.65;
        p.legs[0].rotation.x = s;
        p.legs[1].rotation.x = -s;
        p.arms[0].rotation.x = -s * 0.8;
        p.arms[1].rotation.x = s * 0.8;
        p.g.position.y = Math.abs(Math.cos(p._phase)) * 0.06;
      } else {
        for (const l of [...p.legs, ...p.arms]) l.rotation.x *= 0.8;
        p.g.position.y *= 0.8;
      }
    }

    function faceToward(g, dx, dz, dt) {
      const want = Math.atan2(dx, dz);
      let diff = want - g.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      g.rotation.y += diff * Math.min(1, dt * 12);
    }

    function tick() {
      raf = requestAnimationFrame(tick);
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const p = player.g.position;

      // keyboard
      let mx = 0;
      let mz = 0;
      for (const k of keys) {
        mx += KEYMAP[k][0];
        mz += KEYMAP[k][1];
      }
      let moving = false;
      if (mx || mz) {
        const len = Math.hypot(mx, mz);
        const step = SPEED * dt;
        moving = tryMove((mx / len) * step, (mz / len) * step);
        faceToward(player.g, mx, mz, dt);
      } else if (path.length) {
        const wp = path[0];
        const dx = wp.x - p.x;
        const dz = wp.y - p.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.15) {
          path.shift();
          stuckTime = 0;
          if (!path.length && targetRoom) {
            const id = targetRoom;
            targetRoom = null;
            cbRef.current.onArrive?.(id);
          }
        } else {
          const step = Math.min(dist, SPEED * dt);
          moving = tryMove((dx / dist) * step, (dz / dist) * step);
          faceToward(player.g, dx, dz, dt);
          if (!moving) {
            stuckTime += dt;
            if (stuckTime > 0.4) {
              path.shift();
              stuckTime = 0;
              if (!path.length && targetRoom) {
                const id = targetRoom;
                targetRoom = null;
                cbRef.current.onArrive?.(id);
              }
            }
          }
        }
      }
      animatePerson(player, moving, dt);

      const z = zoneAt(p.x, p.z);
      if (z !== currentZone) {
        currentZone = z;
        cbRef.current.onZoneChange?.(z);
      }

      // stroller paces the lobby
      const sp = stroller.g.position;
      sp.x += strollDir * dt * 1.6;
      if (sp.x > 4) strollDir = -1;
      if (sp.x < -4) strollDir = 1;
      faceToward(stroller.g, strollDir, 0, dt);
      animatePerson(stroller, true, dt, 0.6);

      // idle life
      receptionist.head.rotation.y = Math.sin(t * 0.7) * 0.35;
      receptionist.g.rotation.y = Math.atan2(p.x - receptionist.g.position.x, p.z - receptionist.g.position.z) * 0.4;
      workers.forEach((w, i) => {
        w.arms[0].rotation.x = -0.9 + Math.sin(t * 9 + i) * 0.08;
        w.arms[1].rotation.x = -0.9 + Math.cos(t * 8 + i * 2) * 0.08;
        w.head.rotation.y = Math.sin(t * 0.5 + i * 1.7) * 0.25;
      });
      signs.forEach((s, i) => (s.position.y = s.userData.baseY + Math.sin(t * 1.6 + i) * 0.08));
      if (marker.material.opacity > 0) {
        marker.material.opacity = Math.max(0, marker.material.opacity - dt * 0.9);
        marker.scale.setScalar(1 + (0.9 - marker.material.opacity) * 0.6);
      }

      // camera follows loosely; on desktop keep the scene left of the reception card
      desiredTarget.set(p.x * 0.4 + (wide ? 2.2 : 0), 0, (wide ? -2.5 : 3.5) + (p.z - PLAYER_START[1]) * 0.4);
      camTarget.lerp(desiredTarget, Math.min(1, dt * 2.5));
      camera.position.copy(camTarget).add(camOffset);
      camera.lookAt(camTarget);

      renderer.render(scene, camera);
    }
    tick();

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && !document.hidden;
      if (running) clock.getDelta();
    });
    io.observe(mount);
    const onVis = () => {
      running = !document.hidden;
      if (running) clock.getDelta();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("blur", onBlur);
      if (apiRef) apiRef.current = null;
      const shared = new Set(matCache.values());
      scene.traverse((o) => {
        o.geometry?.dispose();
        const m = o.material;
        if (m && !shared.has(m)) {
          m.map?.dispose();
          m.dispose();
        }
      });
      for (const m of matCache.values()) m.dispose();
      matCache.clear();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [apiRef]);

  return (
    <div className="of-canvas" ref={mountRef} aria-hidden="true">
      {failed && <div className="of-fallback">Your browser can&apos;t show the 3D office, but everything is listed below.</div>}
    </div>
  );
}
