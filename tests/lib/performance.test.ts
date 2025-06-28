import { PerformanceCalculator } from '@/lib/performance';
describe('PerformanceCalculator', () => {
  it('retorna instância singleton', () => {
    const perf = PerformanceCalculator.getInstance();
    expect(perf).toBeInstanceOf(PerformanceCalculator);
  });
}); 