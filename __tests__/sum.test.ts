import { expect, test } from '@jest/globals';

// TODO: Replace this file with a real test
function sum(a: number, b: number) {
  return a + b;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});