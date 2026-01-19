/**
 * 数値計算ユーティリティ
 */

export function square(n: number): number {
  return n * n;
}

export function cube(n: number): number {
  return n * n * n;
}

export function power(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

export function absolute(n: number): number {
  return Math.abs(n);
}
