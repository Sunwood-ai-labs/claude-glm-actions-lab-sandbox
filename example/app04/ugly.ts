// Utility functions for basic operations

const numbers = {
  a: 1,
  b: 2,
  c: 3,
};

function add(x: number, y: number): number {
  return x + y;
}

function multiply(a: number, b: number): number {
  return a * b;
}

const config = {
  name: "test",
  value: 123,
};

console.log(config.name);

const array = [1, 2, 3];
for (const item of array) {
  console.log(item);
}

// Simple calculation (replaced eval for security)
const result = 1 + 1;
console.log(result);

export { add };
