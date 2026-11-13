// fukicycle design — アプリの画面の高さ（iPhone のホーム画面から開いたときのずれ）を直す。
// css/app.css と組で使う。アプリの起動時に一度だけ呼ぶ：
//
//   import { setupViewport } from "@fukicycle/design/js/viewport.js";
//   setupViewport();
//
// iOS のホーム画面から開いたアプリ（apple-mobile-web-app-status-bar-style: black-translucent）には、
// 端末・OS の版・ホーム画面に追加したときの設定によって2通りの動きがある（アプリからは選べない）。
//  - A：画面はステータスバーの下から始まる。上の帯は OS が theme-color で塗る
//  - B：画面全体に描かれるのに、ページの高さ（innerHeight）だけがステータスバーの分だけ短い。
//       そのままだと画面の下端に、何も描かれない黒い帯が残る
// B のずれを実測して --fk-bottom-shim に入れ、html に .fk-bottom-shim を付ける。app.css はそのときだけ
// ページをその分伸ばし、伸ばした分が切り取られないよう html・body の overflow: hidden を外す。
// 決め打ちで伸ばすと、ずれていない端末でページがはみ出すので、実際にずれているときだけ伸ばす。
//
// あわせて --fk-vh に実際の画面の高さを入れる。iOS はアプリに戻ってきたときなどに 100dvh を
// 計算し直さないことがあるため、戻ってくるたびに測り直す。高さは innerHeight で測る
// （visualViewport はキーボードを出すと縮むので、入力のたびに画面全体がガクンと動いてしまう）。
//
// (c) 2026 Fuki Sato — MIT License

/** ステータスバーより大きな差は測り違い（ブラウザのバーなど）とみなす */
export const MAX_BOTTOM_SHIM_PX = 120;

/**
 * 画面の高さとページの高さの差（B のときに下端に残る帯の高さ）。
 * 差が無い・負・大きすぎるときは、伸ばさない意味の 0。
 * @param {number} screenHeight
 * @param {number} innerHeight
 * @returns {number}
 */
export function measureBottomShim(screenHeight, innerHeight) {
  const shortfall = Math.round(screenHeight - innerHeight);
  return Number.isFinite(shortfall) && shortfall > 0 && shortfall <= MAX_BOTTOM_SHIM_PX ? shortfall : 0;
}

const isStandalone = () =>
  window.navigator.standalone === true || window.matchMedia?.("(display-mode: standalone)").matches === true;

/**
 * --fk-vh・--fk-bottom-shim を測って入れ、アプリに戻ったとき・回転したときに測り直す。
 * 戻り値は後始末の関数。
 * @returns {() => void}
 */
export function setupViewport() {
  const root = document.documentElement;
  let frame = 0;
  let rotateTimer = 0;

  const apply = () => {
    if (document.visibilityState === "hidden") return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      root.style.setProperty("--fk-vh", `${window.innerHeight}px`);
      const shim = isStandalone() && window.screen ? measureBottomShim(window.screen.height, window.innerHeight) : 0;
      root.style.setProperty("--fk-bottom-shim", `${shim}px`);
      root.classList.toggle("fk-bottom-shim", shim > 0);
    });
  };

  // 伸ばした分だけページが動けてしまうので、引っぱられても先頭に留める
  const pin = () => {
    if (window.scrollY !== 0 && root.classList.contains("fk-bottom-shim")) window.scrollTo(0, 0);
  };
  // 向きを変えた直後は古い大きさが返るので、落ち着いてから測り直す
  const rotate = () => {
    clearTimeout(rotateTimer);
    rotateTimer = window.setTimeout(apply, 300);
  };

  apply();
  window.addEventListener("resize", apply);
  window.addEventListener("pageshow", apply);
  window.addEventListener("focus", apply);
  document.addEventListener("visibilitychange", apply);
  window.addEventListener("orientationchange", rotate);
  window.addEventListener("scroll", pin, { passive: true });

  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(rotateTimer);
    window.removeEventListener("resize", apply);
    window.removeEventListener("pageshow", apply);
    window.removeEventListener("focus", apply);
    document.removeEventListener("visibilitychange", apply);
    window.removeEventListener("orientationchange", rotate);
    window.removeEventListener("scroll", pin);
  };
}
