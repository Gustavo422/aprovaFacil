import { AppError } from '@/src/core/errors/AppError';
describe('AppError', () => {
  it('cria erro de autenticação', () => {
    const err = AppError.authentication('msg');
    expect(err).toBeInstanceOf(AppError);
    expect(err.message).toBe('msg');
  });
  it('cria erro de autorização', () => {
    const err = AppError.authorization('msg');
    expect(err).toBeInstanceOf(AppError);
  });
  it('cria erro de sistema', () => {
    const err = AppError.system('msg');
    expect(err).toBeInstanceOf(AppError);
  });
}); 