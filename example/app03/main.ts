import { add, multiply, numberToWordOrConcat } from "./messy";

// Test the utility functions
const sum = add(10, 20);
const product = multiply(5, 3);
const word = numberToWordOrConcat(1, "hello", "world");

console.log("Results:", { sum, product, word });
