// サイコロアプリ
class DiceApp {
    constructor() {
        this.dice = document.getElementById('dice');
        this.rollBtn = document.getElementById('rollBtn');
        this.resultDisplay = document.getElementById('result');
        this.historyList = document.getElementById('historyList');
        this.history = [];
        this.isRolling = false;

        // 各面の回転角度
        this.faceRotations = {
            1: { x: 0, y: 0 },
            2: { x: 0, y: -90 },
            3: { x: 0, y: -180 },
            4: { x: 0, y: 90 },
            5: { x: -90, y: 0 },
            6: { x: 90, y: 0 }
        };

        this.init();
    }

    init() {
        // 初期状態: 1の面を表示
        this.showFace(1);

        // ボタンクリックイベント
        this.rollBtn.addEventListener('click', () => this.roll());

        // 履歴リストの初期クラス
        this.historyList.classList.add('empty');
    }

    showFace(value) {
        // すべての面のactiveクラスを解除
        const faces = this.dice.querySelectorAll('.dice-face');
        faces.forEach(face => face.classList.remove('active'));

        // 指定された面をアクティブに
        const targetFace = this.dice.querySelector(`[data-value="${value}"]`);
        if (targetFace) {
            targetFace.classList.add('active');
        }
    }

    roll() {
        if (this.isRolling) return;

        this.isRolling = true;
        this.rollBtn.disabled = true;

        // 1〜6のランダムな値
        const result = Math.floor(Math.random() * 6) + 1;

        // ロールアニメーション
        this.dice.classList.add('rolling');

        // アニメーション後に結果を表示
        setTimeout(() => {
            this.dice.classList.remove('rolling');

            // 現在の回転角度を取得して、新しい角度を計算
            const currentTransform = this.dice.style.transform || '';
            const currentRotation = this.parseRotation(currentTransform);

            // 目的面の回転角度に追加回転を加えて、自然な回転に見せる
            const extraRotations = 720 + Math.floor(Math.random() * 360); // 少なくとも2回転
            const targetRotation = this.faceRotations[result];

            const newRotation = {
                x: currentRotation.x + extraRotations + (targetRotation.x - (currentRotation.x % 360)),
                y: currentRotation.y + extraRotations + (targetRotation.y - (currentRotation.y % 360))
            };

            this.dice.style.transform = `rotateX(${newRotation.x}deg) rotateY(${newRotation.y}deg)`;

            // 面を切り替え（フォールバック用）
            setTimeout(() => {
                this.showFace(result);
                this.displayResult(result);
                this.addToHistory(result);

                this.isRolling = false;
                this.rollBtn.disabled = false;
            }, 1000);

        }, 1000);
    }

    parseRotation(transform) {
        // transform文字列から回転角度を抽出
        const xMatch = transform.match(/rotateX\(([-\d.]+)deg\)/);
        const yMatch = transform.match(/rotateY\(([-\d.]+)deg\)/);

        return {
            x: xMatch ? parseFloat(xMatch[1]) : 0,
            y: yMatch ? parseFloat(yMatch[1]) : 0
        };
    }

    displayResult(value) {
        this.resultDisplay.textContent = value;

        // アニメーション
        this.resultDisplay.style.transform = 'scale(1.5)';
        setTimeout(() => {
            this.resultDisplay.style.transform = 'scale(1)';
        }, 200);
    }

    addToHistory(value) {
        // 履歴に追加
        this.history.unshift({
            value: value,
            time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });

        // 最大10件まで保持
        if (this.history.length > 10) {
            this.history.pop();
        }

        this.renderHistory();
    }

    renderHistory() {
        this.historyList.classList.remove('empty');
        this.historyList.innerHTML = '';

        this.history.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.time}: ${item.value} の目`;
            this.historyList.appendChild(li);
        });
    }
}

// アプリ起動
document.addEventListener('DOMContentLoaded', () => {
    new DiceApp();
});
