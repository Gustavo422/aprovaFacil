import { signIn } from '@/app/actions/auth';
describe('signIn', () => {
  it('deve ser uma função', () => {
    expect(typeof signIn).toBe('function');
  });
}); 