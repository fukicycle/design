// node --test js/viewport.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { measureBottomShim } from "./viewport.js";

test("ページが画面よりステータスバーの分だけ短いときは、その差を返す", () => {
  assert.equal(measureBottomShim(852, 793), 59);
});

test("ずれていない・ブラウザのバーで大きく違う・逆向きのときは伸ばさない", () => {
  assert.equal(measureBottomShim(852, 852), 0);
  assert.equal(measureBottomShim(852, 660), 0);
  assert.equal(measureBottomShim(852, 900), 0);
});
