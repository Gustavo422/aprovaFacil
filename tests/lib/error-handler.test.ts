import { ErrorHandler, ValidationError } from '@/lib/error-handler';
describe('ErrorHandler', () => {
  it('cria instância singleton', () => {
    const handler = ErrorHandler.getInstance();
    expect(handler).toBeInstanceOf(ErrorHandler);
  });
  it('cria ValidationError', () => {
    const err = new ValidationError('msg', 'field');
    expect(err).toBeInstanceOf(Error);
    expect(err.field).toBe('field');
  });
}); 