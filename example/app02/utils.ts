/**
 * サンプルユーティリティ関数
 */

export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

// 日本語版の挨拶関数を追加
export function greetJa(name: string): string {
  return `こんにちは、${name}さん！`;
}
