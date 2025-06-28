import { SoftDeleteManager } from '@/lib/soft-delete';
describe('SoftDeleteManager methods', () => {
  it('verifica se métodos públicos existem', () => {
    expect(SoftDeleteManager.prototype.exportHistoricalData).toBeDefined();
  });
}); 