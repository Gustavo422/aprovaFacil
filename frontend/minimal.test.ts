import { test, expect } from 'vitest';

test('1 + 1 should equal 2', () => {
  expect(1 + 1).toBe(2);
});

test('should pass with correct assertion', () => {
  // This test should pass
  expect(1 + 1).toBe(2);
});
