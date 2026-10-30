# fukicycle design

**和の線と、重なるガラス。**
Fuki Sato（fukicycle）が作るアプリで共通して使うデザインシステムです。色・文字・余白の決まり（トークン）、UIアイコン50個、ガラス表現のCSSをまとめています。

新しいアプリは雛形リポジトリ（`fukicycle/app-template`）から作り、このパッケージを読み込んで使います。デザインを直したらこのリポジトリのタグを上げ、各アプリで更新すれば反映されます。

> もじふるのように雰囲気が違うアプリでは、色とアイコンだけ差し替えます。設定画面への入り方や更新の仕組みといった**構造は全アプリ共通**です（→ [DESIGN.md](./DESIGN.md)）。

---

## 中身

| 場所 | 内容 |
|---|---|
| `tokens/tokens.json` | **唯一の正本。** 色（昼・夜）、文字、余白、角丸、影、サイズ |
| `css/tokens.css` | `tokens.json` から生成した CSS 変数（`--fk-*`）。手で編集しない |
| `css/base.css` | 地の色・文字、すりガラスの面（`.fk-glass`）、青海波の地（`.fk-seigaiha`）、アイコンボタン |
| `icons/line/*.svg` | 線のアイコン（通常時） |
| `icons/glass/*.svg` | ガラスのアイコン（選択中・有効なとき） |
| `icons/icons.json` | 各アイコンの名前・置き場所・ユーザーの動機 |
| `DESIGN.md` | デザインのルール。Claude Code が読む前提で書いています |

### 色

| トークン | 用途 |
|---|---|
| `--fk-gofun` | 胡粉。ページの地 |
| `--fk-sumi` / `--fk-sumi-muted` | 墨。本文とアイコンの線 / 補足 |
| `--fk-ai` / `--fk-ai-soft` | 藍。ブランド色・選択中・主ボタン / 淡色の地 |
| `--fk-shu` | 朱。**一画面に一点だけ**（未読の点、達成の演出） |
| `--fk-wakatake` | 若竹。完了 |
| `--fk-kincha` | 金茶。注意 |
| `--fk-error` | エラー（朱とは別の色） |
| `--fk-glass` / `--fk-glass-edge` | すりガラスの面と縁 |

テーマは `<html data-theme="light|dark">` で切り替えます。指定しなければ端末の設定（`prefers-color-scheme`）に従います。

### アイコン

24×24の格子、線幅1.6、端と角は丸。`stroke="currentColor"` で描いてあるので、CSS の `color` で色が変わります。

- **線版**：通常時
- **ガラス版**：選択中のタブ、オンの状態、保存済みなど。同じ形の半透明シートを右下に1.5pxずらして重ねています。シートの色は `--fk-icon-glass`（既定は藍）

ナビゲーション・操作・状態・メディア・時間・人・アプリ固有・和モチーフの50個。意味と置き場所は `icons/icons.json` と [DESIGN.md](./DESIGN.md) を見てください。

---

## 使い方

雛形から作ったアプリには最初から入っています。手で入れる場合は次のとおりです。

```bash
npm install github:fukicycle/design#v0.1.2
```

```ts
// main.tsx など
import "@fukicycle/design/css/tokens.css";
import "@fukicycle/design/css/base.css";
```

```html
<!-- index.html：フォント -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Zen+Old+Mincho:wght@600&display=swap" rel="stylesheet">
```

アイコンは SVG をそのまま（Vite なら `?raw` で）インラインにして使います。`<img>` で読むと色が変えられないので使いません。

### 更新するとき

```bash
npm install github:fukicycle/design#v0.2.0
```

変更内容は [CHANGELOG.md](./CHANGELOG.md) に書きます。

### 色などを変えるとき

1. `tokens/tokens.json` を直す
2. `npm run build` で `css/tokens.css` を作り直す
3. CHANGELOG に書いてタグを打つ（`v0.x.y`）

---

## これから入れるもの

- React 部品：`<Icon name="add" glass />`、画面の枠（上部バー・タブバー）、設定画面、通知（新しい版のお知らせを含む）、取り消し付きトースト、削除確認、空の画面
- Swift（ぽたりん）向けの色定義の自動生成

---

## ライセンス

[MIT License](./LICENSE) © 2026 Fuki Sato

自由に使ってかまいません。使うときは、ライセンスの条件どおり著作権表示と LICENSE を残してください。アプリの「このアプリについて」などにクレジットを書いてもらえるとうれしいです（任意）。

**「fukicycle」の名前とロゴは、このライセンスに含まれません。** 素材を使ったアプリを、fukicycle の作品のように見せることはしないでください。
