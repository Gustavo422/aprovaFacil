import { render } from '@testing-library/react';
import ForgotPasswordClient from '@/app/forgot-password/forgot-password-client';

describe('ForgotPasswordClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<ForgotPasswordClient />);
  });
}); 