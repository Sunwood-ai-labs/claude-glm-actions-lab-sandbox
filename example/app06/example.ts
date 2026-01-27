/**
 * 電卓アプリの使用例
 * 実行方法: npx tsx example.ts
 *
 * @author Misaki-senpai ✨
 */

import { Calculator, calculate, chainCalculate } from './calculator';

console.log('🎉 電卓アプリの使用例\n');
console.log('='.repeat(40));

// ============================================
// 例1: Calculatorクラスを使った方法
// ============================================
console.log('\n### 例1: Calculatorクラス ###\n');

const calc = new Calculator(10);

console.log(`初期値: ${calc.getValue()}`);

const addResult = calc.add(5);
console.log(`10 + 5 = ${addResult.value}`);

const subResult = calc.subtract(3);
console.log(`15 - 3 = ${subResult.value}`);

const mulResult = calc.multiply(2);
console.log(`12 × 2 = ${mulResult.value}`);

// リセットして新しい計算
calc.clear();
calc.setValue(100);

const divResult = calc.divide(4);
console.log(`\nリセットして 100 ÷ 4 = ${divResult.value}`);

// ============================================
// 例2: 汎用calculate関数を使った方法
// ============================================
console.log('\n### 例2: calculate関数 ###\n');

const result1 = calculate(10, '+', 5);
console.log(`10 + 5 = ${result1.value}`);

const result2 = calculate(20, '-', 8);
console.log(`20 - 8 = ${result2.value}`);

const result3 = calculate(6, '*', 7);
console.log(`6 × 7 = ${result3.value}`);

const result4 = calculate(15, '/', 3);
console.log(`15 ÷ 3 = ${result4.value}`);

// 小数の計算
const result5 = calculate(3.14, '*', 2);
console.log(`\n3.14 × 2 = ${result5.value}`);

// ============================================
// 例3: エラーハンドリング（ゼロ除算）
// ============================================
console.log('\n### 例3: エラーハンドリング ###\n');

const zeroDivResult = calculate(10, '/', 0);
if (zeroDivResult.error) {
  console.log(`10 ÷ 0 = ${zeroDivResult.error}`);
} else {
  console.log(`10 ÷ 0 = ${zeroDivResult.value}`);
}

// Calculatorクラスでのエラーハンドリング
const calc2 = new Calculator(50);
const divError = calc2.divide(0);
if (divError.error) {
  console.log(`${calc2.getValue()} ÷ 0 = ${divError.error}`);
}

// ============================================
// 例4: チェーン計算
// ============================================
console.log('\n### 例4: チェーン計算 ###\n');

const chainResult = chainCalculate(100, [
  ['+', 10],   // 100 + 10 = 110
  ['*', 2],    // 110 * 2 = 220
  ['-', 20],   // 220 - 20 = 200
  ['/', 4]     // 200 / 4 = 50
]);
console.log(`100 + 10 × 2 - 20 ÷ 4 = ${chainResult.value}`);

// ============================================
// 例5: 高度な計算
// ============================================
console.log('\n### 例5: 高度な計算 ###\n');

const calc3 = new Calculator(4);

const powerResult = calc3.power(3);
console.log(`4の3乗 = ${powerResult.value}`);

calc3.setValue(16);
const sqrtResult = calc3.squareRoot();
console.log(`√16 = ${sqrtResult.value}`);

// 負の数の平方根（エラーになる）
calc3.setValue(-4);
const sqrtError = calc3.squareRoot();
if (sqrtError.error) {
  console.log(`√(-4) = ${sqrtError.error}`);
}

console.log('\n' + '='.repeat(40));
console.log('✨ 計算完了！');
