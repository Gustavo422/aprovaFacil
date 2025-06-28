import { render } from '@testing-library/react';
import SimuladosLoadingPage from '@/app/dashboard/simulados-personalizados/loading';
describe('SimuladosLoadingPage (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<SimuladosLoadingPage />);
  });
}); 