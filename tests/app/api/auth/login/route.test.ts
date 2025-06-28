import * as loginRoute from '@/app/api/auth/login/route';
describe('login route', () => {
  it('exporta POST', () => {
    expect(typeof loginRoute.POST).toBe('function');
  });
}); 