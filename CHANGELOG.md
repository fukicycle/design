# 変更履歴

## v0.3.1 — 2026-11-13

- iPhone のホーム画面から開いたアプリで、画面の下端に黒い帯が残るのを直す仕組みを追加
  - `js/viewport.js` の `setupViewport()`：ページが画面より短くなった分を測って `--fk-bottom-shim` に入れ、html に `.fk-bottom-shim` を付ける。あわせて実際の画面の高さを `--fk-vh` に入れ、アプリに戻ったとき・回転したときに測り直す（iOS が 100dvh を計算し直さないことがあるため）
  - `css/app.css`：`body` の高さを `--fk-vh` ＋ ずれにする。ずれがあるときだけページを伸ばし、伸ばした分が切り取られないよう `html`・`body` の `overflow: hidden` を外す。`body` を `position: relative` にし、画面を覆う膜の基準にする
  - 高さはキーボードで縮まない `innerHeight` で測る（入力のたびに画面全体が動かないように）
- DESIGN.md（スクロール）：アプリは起動時に `setupViewport()` を呼ぶ。画面を覆う膜は `fixed` にせず `body` の直下に `absolute` で描く。`fixed` の主ボタン・トーストは `--fk-bottom-shim` の分だけ位置を戻す

### v0.3.0 から上げるとき

- アプリは起動時に `setupViewport()` を呼ぶ（呼ばなければ今までと同じ動き）
- `position: fixed; inset: 0` の膜（シート・ダイアログの背景）は `position: absolute` にし、`body` の直下に描く
- 製品で同じ仕組みを持っていれば（貯金のおうちの `src/app/iosViewport.ts` など）、この版に置き換えて消してよい

## v0.3.0 — 2026-11-13

**グラデーションとガラスを、fukicycle の見分け方としてはっきり見せるようにしました。**

- 差し色のグラデーションを追加：製品は `--fk-accent-2`（なくてもよい）を渡せる。`--fk-accent-gradient` を主ボタン（`.fk-button--primary`）と、画面でいちばん大きな数字（`.fk-gradient-text`、新規）に使う。`accent-2` を渡さなければ今までどおり差し色1色
- `npx fk-contrast` に6つ目の色（`accent-2`）を渡せるようにした。地と主ボタンの文字に対して 4.5:1 以上か確かめる
- iPhone の Safari で、日付・時刻の欄（`.fk-input`）が画面からはみ出し、余白が効かないのを直した。`select.fk-input` の標準の見た目も外した
- DESIGN.md
  - 質感は「地のグラデーション・浮かぶガラス・地の凹凸」の3つと明記
  - 地の2色は、並べて違いが分かる程度に変える
  - トップバーもタブバーと同じく浮かせたガラスにし、中身をその下に流す
  - 「まとめの札」：画面でいちばん見てほしいまとまりを、一画面に一枚だけガラスに乗せてよい
  - シート・ダイアログ・トーストは `body` の直下に描く（Safari でタブバーの下に潜らないように）
  - 画面の上端に白・黒の帯を出さない（`black-translucent` と `theme-color` の合わせ方）
  - ログイン前の画面はログインのボタンだけ

### v0.2.x から上げるとき

- 何もしなくても見た目は変わらない（`accent-2` を渡したときだけグラデーションになる）。ただし `.fk-button--primary` の `background` は `--fk-accent-gradient` になった。製品で `.fk-button--primary` の背景を上書きしていれば、その上書きは消してよい

## v0.2.0 — 2026-11-13

**色を持たないデザインシステムに変えました。** テーマカラーは製品ごとに決め、5色を渡します。質感（凹凸とガラス）とアイコン、置き場所の決まりは全製品で同じです。

- 製品から受け取る色：`--fk-ground-1`・`--fk-ground-2`（地のグラデーション）、`--fk-ink`、`--fk-accent`、`--fk-on-accent`
- 影・光・沈んだ面・ガラスの影を、渡された色から計算するようにした（`oklch(from …)`。古いブラウザには代わりの値）
- `css/material.css` を追加：地（`.fk-ground`）、凹凸（`.fk-up`・`.fk-up-s`・`.fk-down`・`.fk-groove`・`.fk-relief`）、ガラス（`.fk-glass` ＋ `.fk-glass-bd` ＋ `.fk-glass-in`。明るい中身の上に重なる札は `.fk-glass--legible`）、ボタン、アイコンボタン、入力欄
- `css/app.css` を追加：アプリの枠（一番外側をスクロールさせない、`.fk-scroll`）
- `npx fk-contrast` を追加：渡す色で文字が読めるか確かめる
- アイコンを追加：`expand`（折りたたんだ行を開く）
- 角丸を役割ごとの名前に変更（`radius-field`・`radius-button`・`radius-glass`・`radius-plate`）
- 原則を書き直した：地は2色のグラデーション、凹凸は地の一部、ガラスは浮いている層だけ、本文は地に直接、選んでいるものは沈めて差し色に

### v0.1.x から上げるとき

- **色の変数がなくなりました。** `--fk-gofun`・`--fk-sumi`・`--fk-ai`・`--fk-shu` などを使っている所は、製品の CSS 変数に置き換えてください。以前と同じ色にしたいときは、次を渡します

  ```css
  :root { --fk-ground-1: #f3f4f1; --fk-ground-2: #f3f4f1; --fk-ink: #1f252b; --fk-accent: #24557a; --fk-on-accent: #ffffff; }
  :root[data-theme="dark"] { --fk-ground-1: #15191e; --fk-ground-2: #15191e; --fk-ink: #e8ebe7; --fk-accent: #86b5da; --fk-on-accent: #0e1a25; }
  ```

- `css/base.css` は `css/material.css`（部品）と `css/app.css`（アプリの枠）に分かれました
- `.fk-glass` は中身を `.fk-glass-bd` と `.fk-glass-in` に分ける形になりました
- `.fk-seigaiha`（青海波の地）を削除しました。地に模様は敷きません（アイコンの `seigaiha` は残っています）
- 書体の指定（`--fk-font-*`、`.fk-text-*`）を削除しました。書体は製品ごとに決めます
- `--fk-radius-md` → `--fk-radius-button`（入力欄は `--fk-radius-field`）、`--fk-radius-lg` → `--fk-radius-glass`、`--fk-shadow-glass` → `--fk-glass-cast`

## v0.1.2 — 2026-10-30

- テーマ用のアイコンを追加：`sun`（昼）、`moon`（夜）、`theme-auto`（自動）
- アプリの一番外側をスクロールさせないルールと `base.css` の設定を追加。スクロールは `.fk-scroll` の領域だけで行う
- アイコンボタンのホバー色をマウスのときだけにした（スマホで押した後に色が残らないように）
- 原則に「面より線」「選んでいるものには藍の線」「背景に模様を敷かない」を追加。ガラスは下が透けるものだけに使う

## v0.1.1 — 2026-10-30

- 新しい版のお知らせを通知に集約（バナーは使わない）。通知アイコンは全アプリで常に表示し、未読は朱の点で示す
- リリースノートを使う人の言葉で書くルールを追加
- `update`・`notify`・`settings` アイコンの置き場所の説明を更新

## v0.1.0 — 2026-10-30

- 最初の版
- トークン（色は昼・夜の2テーマ、文字、余白、角丸、影、サイズ）
- UIアイコン50個（線版・ガラス版）と `icons.json`
- `css/tokens.css`（生成）と `css/base.css`
- `DESIGN.md`
