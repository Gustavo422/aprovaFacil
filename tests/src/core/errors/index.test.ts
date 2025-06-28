import { initializeErrorHandling } from '@/src/core/errors';
describe('initializeErrorHandling', () => {
  it('executa sem lançar erro', () => {
    expect(() => initializeErrorHandling()).not.toThrow();
  });
}); 