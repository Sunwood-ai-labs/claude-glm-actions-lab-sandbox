// Utility functions for math operations

/**
 * Adds two numbers together
 */
function add(a: number, b: number): number {
  return a + b;
}

/**
 * Multiplies two numbers together
 */
function multiply(x: number, y: number): number {
  return x * y;
}

/**
 * Returns the word representation of a number (1-3),
 * or concatenates the two strings if number is not 1-3
 */
function numberToWordOrConcat(num: number, str1: string, str2: string): string {
  if (num === 1) return "one";
  if (num === 2) return "two";
  if (num === 3) return "three";
  return str1 + str2;
}

// Data object with clear property names
const data = {
  name: "test",
  value: 123,
};

// Perform calculations
let result = add(1, 2);
result = add(result, 3);

// Double each element in the array
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);

export { add, multiply, numberToWordOrConcat };
