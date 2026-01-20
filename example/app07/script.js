// おみくじのデータ
const omikujiData = [
    { rank: '大吉', message: '素晴らしい一年になりそう！✨', class: 'luck-daikichi' },
    { rank: '中吉', message: '順調に進みます🌸', class: 'luck-chukichi' },
    { rank: '小吉', message: '小さな幸せがいっぱい💖', class: 'luck-shokichi' },
    { rank: '吉', message: '良好な運勢です☀️', class: 'luck-kichi' },
    { rank: '末吉', message: 'ゆっくりと良い方向へ🌱', class: 'luck-sue' },
    { rank: '凶', message: '慎重に行動しましょう💦', class: 'luck-sue' },
];

let history = [];

// DOM要素
const resultEl = document.getElementById('result');
const messageEl = document.getElementById('message');
const drawButton = document.getElementById('drawButton');
const historyList = document.getElementById('historyList');

// おみくじを引く関数
function drawOmikuji() {
    // アニメーション
    drawButton.classList.add('shaking');
    drawButton.disabled = true;

    // シェイクアニメーション中に結果をランダムに表示
    let count = 0;
    const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * omikujiData.length);
        const randomResult = omikujiData[randomIndex];
        resultEl.textContent = randomResult.rank;
        count++;
        if (count > 10) {
            clearInterval(interval);
            showFinalResult();
        }
    }, 100);
}

// 最終結果を表示
function showFinalResult() {
    // 重み付け付きランダム選択
    const weights = [5, 20, 25, 25, 15, 10]; // 大吉はレア、凶も少なめ
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    let selectedIndex = 0;
    for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            selectedIndex = i;
            break;
        }
    }

    const result = omikujiData[selectedIndex];

    // 結果を表示
    resultEl.textContent = result.rank;
    resultEl.className = 'result ' + result.class;
    messageEl.textContent = result.message;

    // 履歴に追加
    addToHistory(result);

    // ボタンを有効化
    setTimeout(() => {
        drawButton.classList.remove('shaking');
        drawButton.disabled = false;
    }, 500);
}

// 履歴に追加
function addToHistory(result) {
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    history.unshift({ ...result, time: timeStr });

    // 最大10件まで保持
    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    updateHistoryDisplay();
}

// 履歴を更新
function updateHistoryDisplay() {
    historyList.innerHTML = '';

    history.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${item.class}">${item.rank}</span>
            <span>${item.time}</span>
        `;
        historyList.appendChild(li);
    });
}

// イベントリスナー
drawButton.addEventListener('click', drawOmikuji);

// 初期表示
resultEl.textContent = '？';
messageEl.textContent = 'ボタンを押してね！';
