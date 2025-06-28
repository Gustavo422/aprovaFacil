import { cn } from '@/lib/utils';
describe('cn', () => {
  it('combina classes corretamente', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
}); 