# fukicycle design

**地の凹凸と、浮かぶガラス。**
Fuki Sato（fukicycle）が作るアプリとサイトで共通して使うデザインシステムです。凹凸とガラスの質感、UIアイコン54個、置き場所と画面の構造の決まりをまとめています。

**色は持ちません。** テーマカラーは製品ごとに決め、このパッケージに5色を渡します。影・光・ガラスはその色から計算されるので、緑でも青でもパステルでも、同じ質感に見えます。

新しいアプリは雛形リポジトリ（`fukicycle/app-template`）から作り、このパッケージを読み込んで使います。

---

## 中身

| 場所 | 内容 |
|---|---|
| `tokens/tokens.json` | **唯一の正本。** 製品から受け取る色、質感の計算式（昼・夜）、余白、角丸、サイズ |
| `css/tokens.css` | `tokens.json` から生成した CSS 変数（`--fk-*`）。手で編集しない |
| `css/material.css` | 地・凹凸・ガラス・ボタン・入力欄・アイコンの部品。サイトでもアプリでも使う |
| `css/app.css` | アプリの枠（一番外側をスクロールさせない、`.fk-scroll`）。アプリだけで使う |
| `icons/line/*.svg` | 線のアイコン（通常時） |
| `icons/glass/*.svg` | ガラスのアイコン（選択中・有効なとき） |
| `icons/icons.json` | 各アイコンの名前・置き場所・ユーザーの動機 |
| `scripts/check-contrast.mjs` | 渡す色で文字が読めるか確かめる（`npx fk-contrast`） |
| `DESIGN.md` | デザインのルール。Claude Code が読む前提で書いています |
| `preview/index.html` | 3つの色で同じ質感になるかを見る見本 |

---

## 使い方

```bash
npm install github:fukicycle/design#v0.2.0
```

```ts
// main.tsx など
import "@fukicycle/design/css/tokens.css";
import "@fukicycle/design/css/material.css";
import "@fukicycle/design/css/app.css"; // アプリのときだけ
import "./theme.css";                    // 製品の色
```

### 製品の色を渡す

```css
/* theme.css */
:root {
  --fk-ground-1: #cfe8dd;
  --fk-ground-2: #e2e6d2;
  --fk-ink: #17261f;
  --fk-accent: #2e5b4a;
  --fk-on-accent: #ffffff;
}

:root[data-theme="dark"] {
  --fk-ground-1: #06130d;
  --fk-ground-2: #143f2e;
  --fk-ink: #eef2fc;
  --fk-accent: #a6d4bf;
  --fk-on-accent: #0c1f18;
}
```

テーマは `<html data-theme="light|dark">` で切り替えます。描画の前に、保存した選択か端末の設定（`prefers-color-scheme`）から `data-theme` を決めるスクリプトを `<head>` に置いてください（指定がない間は、質感だけ端末の設定に従います）。

色を決めたら確かめます。昼と夜で1回ずつ。

```bash
npx fk-contrast "#cfe8dd" "#e2e6d2" "#17261f" "#2e5b4a" "#ffffff"
```

### 部品

```html
<header class="fk-glass">
  <div class="fk-glass-bd"></div>
  <div class="fk-glass-in">…</div>
</header>

<section class="fk-up">浮いた板</section>
<div class="fk-down">沈んだ受け皿</div>
<hr class="fk-groove" />

<button class="fk-button fk-button--primary">保存する</button>
<button class="fk-icon-button" aria-label="設定">…settings.svg…</button>
<input class="fk-input" />
```

ガラスの中にガラスを入れないでください。詳しくは [DESIGN.md](./DESIGN.md)。

### アイコン

24×24の格子、線幅1.6、端と角は丸。`stroke="currentColor"` で描いてあるので、CSS の `color` で色が変わります。SVG をそのまま（Vite なら `?raw` で）インラインにして使います。`<img>` で読むと色が変えられないので使いません。

- **線版**：通常時
- **ガラス版**：選択中のタブ、オンの状態、保存済みなど。同じ形の半透明シートを右下に1.5pxずらして重ねています。シートの色は差し色（`--fk-icon-glass`）

意味と置き場所は `icons/icons.json` と [DESIGN.md](./DESIGN.md) を見てください。

### 対応ブラウザ

影と光の色の計算に `oklch(from …)` を使います（Safari 18、Chrome 119、Firefox 128 以降）。それより古いブラウザでは、文字の色を混ぜた影で代わりに表示します（色味は出ませんが、凹凸とガラスの形は保ちます）。

---

## 直すとき

1. `tokens/tokens.json` を直す（質感の計算式・余白・角丸など）
2. `npm run build` で `css/tokens.css` を作り直す
3. `preview/index.html` をブラウザで開き、3つの色の昼・夜で崩れていないか見る
4. CHANGELOG に書いてタグを打つ（`v0.x.y`）。各製品は `npm install github:fukicycle/design#v0.x.y` で上げる

---

## これから入れるもの

- React 部品：`<Icon name="add" glass />`、画面の枠（上部バー・タブバー）、設定画面、通知（新しい版のお知らせを含む）、取り消し付きトースト、削除確認、空の画面
- Swift（ぽたりん）向けの質感の定義

---

## ライセンス

[MIT License](./LICENSE) © 2026 Fuki Sato

自由に使ってかまいません。使うときは、ライセンスの条件どおり著作権表示と LICENSE を残してください。アプリの「このアプリについて」などにクレジットを書いてもらえるとうれしいです（任意）。

**「fukicycle」の名前とロゴは、このライセンスに含まれません。** 素材を使ったアプリを、fukicycle の作品のように見せることはしないでください。
