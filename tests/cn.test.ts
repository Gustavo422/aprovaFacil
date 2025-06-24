import { describe, it, expect } from 'vitest';
import { cn } from '../lib/utils';

describe('cn', () => {
  it('deve combinar classes corretamente', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('deve ignorar valores falsy', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('deve mesclar classes do tailwind corretamente', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4'); // tailwind-merge mantém apenas a última
  });
}); 