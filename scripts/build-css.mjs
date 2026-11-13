// tokens/tokens.json から css/tokens.css を生成する。
// tokens.json が唯一の正本。css/tokens.css は手で編集しない。
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const t = JSON.parse(readFileSync(join(root, "tokens/tokens.json"), "utf8"));
const P = "--fk-";
const decl = (list, indent = "  ") => list.map((k) => `${indent}${P}${k.name}: ${k.value};`).join("\n");
const m = t.material;

const fixed = [];
for (const fam of ["spacing", "radius", "size"]) fixed.push(...t[fam].tokens);

const css = `/* fukicycle design — generated from tokens/tokens.json. Do not edit by hand. */
/* (c) 2026 Fuki Sato — MIT License */

/* 色は製品が渡す（このファイルには色の値がない）：
${t.inputs.map((i) => `   ${P}${i.name}  ${i.usage}`).join("\n")}
   質感（凹凸・ガラス）は、渡された色からここで計算する。
   [data-theme] を付けた要素の中では、その要素の色で計算し直す（一部だけ別の色にできる）。 */

:root,
[data-theme] {
${decl(m.base)}
${decl(m.light)}
  color-scheme: light;
}

/* 夜：<html data-theme="dark">。指定がなければ端末の設定に従う */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
${decl(m.dark, "    ")}
    color-scheme: dark;
  }
}

[data-theme="dark"] {
${decl(m.dark)}
  color-scheme: dark;
}

/* oklch(from …) が使えないブラウザでは、文字の色を混ぜた影で代わりにする */
@supports not (color: oklch(from red l c h)) {
  :root,
  [data-theme] {
${decl(m.fallback.light, "    ")}
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme]) {
${decl(m.fallback.dark, "      ")}
    }
  }

  [data-theme="dark"] {
${decl(m.fallback.dark, "    ")}
  }
}

:root {
${decl(fixed)}
}
`;

writeFileSync(join(root, "css/tokens.css"), css);
console.log("css/tokens.css written");
