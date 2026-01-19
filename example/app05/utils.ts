/**
 * App05 サンプルユーティリティ関数
 * 文字列操作と配列操作のユーティリティ
 */

/**
 * 文字列を逆順にする
 */
export function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * 配列から重複を排除する
 */
export function uniqueArray<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 数値配列の合計を計算する
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

/**
 * 文字列をキャメルケースに変換する
 */
export function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

/**
 * 配列をシャッフルする
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
