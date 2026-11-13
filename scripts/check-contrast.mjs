#!/usr/bin/env node
// 製品が渡す5色で、文字が読めるかを確かめる（WCAG 2 のコントラスト比）。
//
//   npx fk-contrast <ground-1> <ground-2> <ink> <accent> <on-accent> [accent-2]
//   例：npx fk-contrast "#CFE8DD" "#E2E6D2" "#17261F" "#2E5B4A" "#FFFFFF"
//   差し色のグラデーションを使うときは、6つ目に終わりの色（accent-2）を渡す。
//
// 昼と夜で、それぞれ1回ずつ実行する。基準を下回るものがあれば終了コード 1。

const [g1, g2, ink, accent, onAccent, accent2] = process.argv.slice(2);
if (!onAccent) {
  console.error("使い方: fk-contrast <ground-1> <ground-2> <ink> <accent> <on-accent> [accent-2]（#RRGGBB）");
  process.exit(2);
}

const rgb = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`#RRGGBB で指定してください: ${hex}`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a, b) => rgb(a).map((v, i) => Math.round((v + rgb(b)[i]) / 2));
const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
const lum = (c) => {
  const [r, g, b] = c.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(rgb(a)), lum(rgb(b))].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const mid = hex(mix(g1, g2));
const checks = [
  ["文字 × 地（1色目）", ink, g1, 4.5],
  ["文字 × 地（2色目）", ink, g2, 4.5],
  ["文字 × 地（中間）", ink, mid, 4.5],
  ["差し色の上の文字", onAccent, accent, 4.5],
  ["差し色のリンク × 地（中間）", accent, mid, 4.5],
  ["主なボタンの形 × 地（中間）", accent, mid, 3],
];
// グラデーションの終わりの色も、文字（大きな数字）として地に、主ボタンの文字の背景として読めること
if (accent2) {
  checks.push(
    ["差し色2 × 地（1色目）", accent2, g1, 4.5],
    ["差し色2 × 地（2色目）", accent2, g2, 4.5],
    ["差し色2の上の文字", onAccent, accent2, 4.5],
  );
}

let ok = true;
for (const [label, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  const pass = r >= min;
  ok &&= pass;
  console.log(`${pass ? "OK" : "NG"}  ${r.toFixed(2).padStart(5)} : 1（基準 ${min}）  ${label}  ${fg} / ${bg}`);
}
if (!ok) {
  console.log("\n基準を下回るものがあります。文字の色か差し色を調整してください。");
  process.exit(1);
}
