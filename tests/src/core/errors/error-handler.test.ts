import { ErrorHandler, handleError, captureAsync } from '@/src/core/errors/ErrorHandler';
describe('ErrorHandler', () => {
  it('retorna instância singleton', () => {
    const handler = ErrorHandler.getInstance();
    expect(handler).toBeInstanceOf(ErrorHandler);
  });
  it('captura erro síncrono', () => {
    const handler = ErrorHandler.getInstance();
    const result = handler.captureSync(() => { throw new Error('fail'); });
    expect(result).toBeNull();
  });
  it('handleError não lança', () => {
    expect(() => handleError(new Error('fail'))).not.toThrow();
  });
  it('captureAsync não lança', async () => {
    await expect(captureAsync(async () => { throw new Error('fail'); })).resolves.toBeNull();
  });
}); 