/**
 * シンプルな電卓アプリ
 * TypeScriptで実装された四則演算対応の電卓
 *
 * @author Misaki-senpai ✨
 * @version 1.0.0
 */

/**
 * 計算結果を表す型
 */
export type CalcResult = {
  value: number;
  error?: string;
};

/**
 * サポートする演算子の型
 */
export type Operator = '+' | '-' | '*' | '/';

/**
 * 計算クラス
 */
export class Calculator {
  private currentValue: number = 0;

  /**
   * コンストラクタ
   * @param initialValue 初期値（デフォルト: 0）
   */
  constructor(initialValue: number = 0) {
    this.currentValue = initialValue;
  }

  /**
   * 現在値を取得
   */
  getValue(): number {
    return this.currentValue;
  }

  /**
   * 値をセット
   */
  setValue(value: number): void {
    this.currentValue = value;
  }

  /**
   * リセット
   */
  clear(): void {
    this.currentValue = 0;
  }

  /**
   * 足し算
   * @param value 加算する値
   */
  add(value: number): CalcResult {
    this.currentValue += value;
    return { value: this.currentValue };
  }

  /**
   * 引き算
   * @param value 減算する値
   */
  subtract(value: number): CalcResult {
    this.currentValue -= value;
    return { value: this.currentValue };
  }

  /**
   * 掛け算
   * @param value 乗算する値
   */
  multiply(value: number): CalcResult {
    this.currentValue *= value;
    return { value: this.currentValue };
  }

  /**
   * 割り算
   * @param value 除算する値
   * @throws {Error} ゼロ除算の場合
   */
  divide(value: number): CalcResult {
    if (value === 0) {
      return {
        value: this.currentValue,
        error: 'ゼロ除算は許可されていません💦'
      };
    }
    this.currentValue /= value;
    return { value: this.currentValue };
  }

  /**
   * 累乗計算
   * @param exponent 指数
   */
  power(exponent: number): CalcResult {
    this.currentValue = Math.pow(this.currentValue, exponent);
    return { value: this.currentValue };
  }

  /**
   * 平方根
   */
  squareRoot(): CalcResult {
    if (this.currentValue < 0) {
      return {
        value: this.currentValue,
        error: '負の数の平方根は計算できません💦'
      };
    }
    this.currentValue = Math.sqrt(this.currentValue);
    return { value: this.currentValue };
  }
}

/**
 * 汎用計算関数
 * @param a 値1
 * @param operator 演算子
 * @param b 値2
 */
export function calculate(a: number, operator: Operator, b: number): CalcResult {
  switch (operator) {
    case '+':
      return { value: a + b };
    case '-':
      return { value: a - b };
    case '*':
      return { value: a * b };
    case '/':
      if (b === 0) {
        return {
          value: a,
          error: 'ゼロ除算は許可されていません💦'
        };
      }
      return { value: a / b };
    default:
      return {
        value: a,
        error: `不明な演算子です: ${operator}`
      };
  }
}

/**
 * 複数の計算をチェーン実行
 * @param initialValue 初期値
 * @param operations 操作の配列 [演算子, 値]
 */
export function chainCalculate(
  initialValue: number,
  operations: [Operator, number][]
): CalcResult {
  let result = initialValue;
  let lastError: string | undefined;

  for (const [operator, value] of operations) {
    const calcResult = calculate(result, operator, value);
    if (calcResult.error) {
      lastError = calcResult.error;
      break;
    }
    result = calcResult.value;
  }

  return {
    value: result,
    error: lastError
  };
}
