# 変更履歴

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
