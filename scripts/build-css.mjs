// tokens/tokens.json から css/tokens.css を生成する。
// tokens.json が唯一の正本。css/tokens.css は手で編集しない。
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const t = JSON.parse(readFileSync(join(root, "tokens/tokens.json"), "utf8"));
const P = "--fk-";

const themes = t.color.themes.map((x) => x.id); // [light, dark]
const ref = (v) => {
  const m = /^\{(.+)\}$/.exec(v);
  return m ? `var(${P}${m[1]})` : v;
};
const pick = (value, theme) =>
  typeof value === "string" ? value : value[theme] ?? value[themes[0]];

const themed = (theme) => {
  const lines = [];
  for (const k of t.color.tokens) lines.push(`  ${P}${k.name}: ${ref(pick(k.value, theme))};`);
  for (const k of t.shadow?.tokens ?? []) lines.push(`  ${P}${k.name}: ${pick(k.value, theme)};`);
  lines.push(`  color-scheme: ${theme === "dark" ? "dark" : "light"};`);
  return lines.join("\n");
};

const fixed = [];
for (const fam of ["spacing", "radius", "size"]) {
  for (const k of t[fam]?.tokens ?? []) fixed.push(`  ${P}${k.name}: ${k.value};`);
}
for (const [k, v] of Object.entries(t.type.families)) fixed.push(`  ${P}font-${k}: ${v};`);

const typeClasses = [];
for (const g of t.type.groups) {
  for (const s of g.styles) {
    const fam = s.family ?? g.family;
    typeClasses.push(
      `.fk-text-${s.name} { font-family: var(${P}font-${fam}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight}; }`
    );
  }
}

const css = `/* fukicycle design — generated from tokens/tokens.json. Do not edit by hand. */
/* (c) 2026 Fuki Sato — MIT License */

:root,
:root[data-theme="light"] {
${themed("light")}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${themed("dark").replace(/^/gm, "  ")}
  }
}

:root[data-theme="dark"] {
${themed("dark")}
}

:root {
${fixed.join("\n")}
}

${typeClasses.join("\n")}
`;

writeFileSync(join(root, "css/tokens.css"), css);
console.log("css/tokens.css written");
