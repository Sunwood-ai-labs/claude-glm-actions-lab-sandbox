const omikujiData = [
  {
    result: "大吉",
    className: "daikichi",
    message: "最高の一日になるでしょう！何をやってもうまくいきそうです！"
  },
  {
    result: "中吉",
    className: "chukichi",
    message: "良い日になるでしょう！前向きに取り組めば成功します！"
  },
  {
    result: "小吉",
    className: "shokichi",
    message: "小さな幸せが訪れるでしょう。日常を楽しみましょう！"
  },
  {
    result: "末吉",
    className: "suekichi",
    message: "努力が実を結ぶのはもう少し後。諦めずに続けましょう！"
  },
  {
    result: "凶",
    className: "kyo",
    message: "注意が必要な日です。慎重に行動しましょう。"
  },
  {
    result: "大凶",
    className: "daikyo",
    message: "今日は大人しく過ごすのが吉。明日はきっと良い日です！"
  }
];

const resultEl = document.getElementById("result");
const messageEl = document.getElementById("message");
const drawBtn = document.getElementById("drawBtn");
const omikujiBox = document.getElementById("omikujiBox");

let isDrawing = false;

drawBtn.addEventListener("click", () => {
  if (isDrawing) return;
  isDrawing = true;

  // リセット
  resultEl.className = "omikuji-result";
  resultEl.textContent = "";
  messageEl.className = "message";
  messageEl.textContent = "";
  drawBtn.disabled = true;

  // シャッフルアニメーション
  let count = 0;
  const shuffle = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * omikujiData.length);
    resultEl.textContent = omikujiData[randomIndex].result;
    omikujiBox.classList.add("shaking");
    count++;

    if (count > 10) {
      clearInterval(shuffle);
      omikujiBox.classList.remove("shaking");

      // 最終結果
      const finalIndex = Math.floor(Math.random() * omikujiData.length);
      const fortune = omikujiData[finalIndex];

      resultEl.textContent = fortune.result;
      resultEl.className = `omikuji-result show ${fortune.className}`;

      messageEl.textContent = fortune.message;
      messageEl.classList.add("show");

      drawBtn.disabled = false;
      drawBtn.textContent = "もう一度引く";
      isDrawing = false;
    }
  }, 100);
});
