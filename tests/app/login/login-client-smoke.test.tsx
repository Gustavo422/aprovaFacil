import { render } from '@testing-library/react';
import LoginClient from '@/app/login/login-client';

describe('LoginClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<LoginClient />);
  });
}); 