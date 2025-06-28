import { signInLogic } from '@/app/actions/auth-logic';
describe('signInLogic', () => {
  it('deve ser uma função', () => {
    expect(typeof signInLogic).toBe('function');
  });
}); 