import { render } from '@testing-library/react';
import RegisterClient from '@/app/register/register-client';

describe('RegisterClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<RegisterClient />);
  });
}); 