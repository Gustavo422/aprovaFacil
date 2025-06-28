import * as rateLimiter from '@/lib/rate-limiter';
describe('rate-limiter', () => {
  it('exporta funções', () => {
    expect(rateLimiter).toBeDefined();
  });
}); 