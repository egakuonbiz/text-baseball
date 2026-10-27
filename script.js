"use strict";

/** 始点からの循環距離を使い、整数だけで判定する独立した関数。 */
function isHit(start, battingAverage, pitcherValue) {
  const distance = (pitcherValue - start + 1000) % 1000;
  // 「未満」にすることで、.300なら始点を含むちょうど300個になる。
  return distance < battingAverage;
}

function randomValue() {
  return Math.floor(Math.random() * 1000);
}

function formatAverage(value) {
  // 10割は1.000、それ以外は野球の表記に合わせて先頭の0を省略。
  return value.toFixed(3).replace(/^0/, "");
}

const player = document.getElementById("player");
const result = document.getElementById("result");
const rangeDescription = document.getElementById("range-description");
let atBats = 0;
let hits = 0;

function renderStats() {
  document.getElementById("at-bats").textContent = atBats;
  document.getElementById("hits").textContent = hits;
  document.getElementById("actual-average").textContent =
    formatAverage(atBats === 0 ? 0 : hits / atBats);
}

function clearLastPlay() {
  for (const id of ["start", "end", "pitch"]) {
    document.getElementById(id).textContent = "---";
  }
  result.textContent = "READY_";
  delete result.dataset.result;
  rangeDescription.textContent = "「打席へ」を押して、プレイ開始。";
}

player.addEventListener("change", () => {
  document.getElementById("player-average").textContent =
    formatAverage(Number(player.value) / 1000);
  // 選手変更時は直前の結果を消し、設定との取り違えを防ぐ。累計は保持。
  clearLastPlay();
});

document.getElementById("bat").addEventListener("click", () => {
  const battingAverage = Number(player.value);
  const start = randomValue();
  const pitcherValue = randomValue();
  // 両端を含むため、終点は長さから1を引いて計算する。
  const end = (start + battingAverage - 1) % 1000;
  const hit = isHit(start, battingAverage, pitcherValue);
  atBats += 1;
  if (hit) hits += 1;

  document.getElementById("start").textContent = start;
  document.getElementById("end").textContent = end;
  document.getElementById("pitch").textContent = pitcherValue;
  result.textContent = hit ? "HIT!" : "OUT!";
  result.dataset.result = hit ? "hit" : "out";
  const range = start <= end ? `${start}〜${end}` : `${start}〜999 と 0〜${end}`;
  const playerName = player.options[player.selectedIndex].text.split(" — ")[0];
  rangeDescription.textContent = `第${atBats}打席 / ${playerName} / 打撃範囲 ${range}（${battingAverage}個）`;
  document.getElementById("reset-message").textContent = "";
  renderStats();
});

document.getElementById("reset").addEventListener("click", () => {
  atBats = 0;
  hits = 0;
  renderStats();
  clearLastPlay();
  document.getElementById("reset-message").textContent = "累計成績をリセットしました。";
});
