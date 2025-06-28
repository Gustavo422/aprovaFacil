import { render } from '@testing-library/react';
import ApostilasPage from '@/app/dashboard/apostila-inteligente/page';
describe('ApostilasPage (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<ApostilasPage />);
  });
}); 