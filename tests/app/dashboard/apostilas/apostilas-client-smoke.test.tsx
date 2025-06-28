import { render } from '@testing-library/react';
import ApostilasClient from '@/app/dashboard/apostila-inteligente/apostilas-client';
describe('ApostilasClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<ApostilasClient />);
  });
}); 