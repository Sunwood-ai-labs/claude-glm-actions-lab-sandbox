/**
 * App05 メインエントリーポイント
 * 実行方法: npx tsx index.ts
 */

import {
  reverseString,
  uniqueArray,
  sum,
  toCamelCase,
  shuffle,
} from './utils';

// サンプル実行

console.log('=== 文字列操作のサンプル ===');
const originalStr = 'Hello World';
const reversed = reverseString(originalStr);
console.log(`"${originalStr}" を逆順にすると: "${reversed}"`);

console.log('\n=== 配列操作のサンプル ===');
const duplicatedArray = [1, 2, 2, 3, 4, 4, 5];
const unique = uniqueArray(duplicatedArray);
console.log(`重複排除前: ${duplicatedArray.join(', ')}`);
console.log(`重複排除後: ${unique.join(', ')}`);

console.log('\n=== 数値計算のサンプル ===');
const numbers = [1, 2, 3, 4, 5];
const total = sum(numbers);
console.log(`${numbers.join(' + ')} = ${total}`);

console.log('\n=== キャメルケース変換のサンプル ===');
const testCases = [
  'hello-world-example',
  'hello_world_example',
  'Hello World Example',
  '  extra--spaces  ',
  'multiple---dashes'
];
testCases.forEach(str => {
  const result = toCamelCase(str);
  console.log(`"${str}" → "${result}"`);
});

console.log('\n=== シャッフルのサンプル ===');
const originalArr = [1, 2, 3, 4, 5];
const shuffled = shuffle(originalArr);
console.log(`元の配列: ${originalArr.join(', ')}`);
console.log(`シャッフル後: ${shuffled.join(', ')}`);

console.log('\n✨ All samples completed successfully!');
