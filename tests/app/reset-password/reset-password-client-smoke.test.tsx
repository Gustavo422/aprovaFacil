import { render } from '@testing-library/react';
import ResetPasswordClient from '@/app/reset-password/reset-password-client';

describe('ResetPasswordClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<ResetPasswordClient />);
  });
}); 