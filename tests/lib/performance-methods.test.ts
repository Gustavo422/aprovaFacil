import { PerformanceCalculator } from '@/lib/performance';
describe('PerformanceCalculator methods', () => {
  it('retorna instância singleton', () => {
    const perf = PerformanceCalculator.getInstance();
    expect(perf).toBeInstanceOf(PerformanceCalculator);
  });
}); 