# シンプル電卓アプリ 🧮

TypeScriptで実装されたシンプルな電卓アプリだよ✨

## 機能

- ✅ 四則演算（+、-、×、÷）
- ✅ 小数の計算対応
- ✅ エラーハンドリング（ゼロ除算、負の数の平方根など）
- ✅ チェーン計算機能
- ✅ 累乗・平方根計算

## 使い方

### インストール

```bash
npm install -g tsx
```

### 実行

```bash
npx tsx example/app06/example.ts
```

## API

### Calculatorクラス

```typescript
import { Calculator } from './calculator';

const calc = new Calculator(10);  // 初期値10で作成

// 基本演算
calc.add(5);       // 足し算: 10 + 5 = 15
calc.subtract(3);  // 引き算: 15 - 3 = 12
calc.multiply(2);  // 掛け算: 12 × 2 = 24
calc.divide(4);    // 割り算: 24 ÷ 4 = 6

// 高度な演算
calc.power(2);     // 累乗: 6² = 36
calc.squareRoot(); // 平方根: √36 = 6

// リセット
calc.clear();      // 0に戻る
calc.setValue(100); // 値を直接セット
```

### calculate関数

```typescript
import { calculate } from './calculator';

const result = calculate(10, '+', 5);
console.log(result.value);  // 15
console.log(result.error);  // undefined

// エラーハンドリング
const errorResult = calculate(10, '/', 0);
console.log(errorResult.value);  // 10
console.log(errorResult.error);  // "ゼロ除算は許可されていません💦"
```

### chainCalculate関数

```typescript
import { chainCalculate } from './calculator';

const result = chainCalculate(100, [
  ['+', 10],   // 100 + 10 = 110
  ['*', 2],    // 110 * 2 = 220
  ['-', 20],   // 220 - 20 = 200
  ['/', 4]     // 200 / 4 = 50
]);
console.log(result.value);  // 50
```

## エラー処理

- ゼロ除算: エラーメッセージを返す
- 負の数の平方根: エラーメッセージを返す
- 不明な演算子: エラーメッセージを返す

## サンプル出力

```
🎉 電卓アプリの使用例

========================================

### 例1: Calculatorクラス ###

初期値: 10
10 + 5 = 15
15 - 3 = 12
12 × 2 = 24

リセットして 100 ÷ 4 = 25

### 例2: calculate関数 ###

10 + 5 = 15
20 - 8 = 12
6 × 7 = 42
15 ÷ 3 = 5

3.14 × 2 = 6.28

### 例3: エラーハンドリング ###

10 ÷ 0 = ゼロ除算は許可されていません💦
50 ÷ 0 = ゼロ除算は許可されていません💦

### 例4: チェーン計算 ###

100 + 10 × 2 - 20 ÷ 4 = 50

### 例5: 高度な計算 ###

4の3乗 = 64
√16 = 4
√(-4) = 負の数の平方根は計算できません💦

========================================
✨ 計算完了！
```

## ライセンス

MIT License

---

作成者: 美咲先輩 ✨💪
