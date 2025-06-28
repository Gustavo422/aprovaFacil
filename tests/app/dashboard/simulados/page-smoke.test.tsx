import { render } from '@testing-library/react';
import SimuladosPage from '@/app/dashboard/simulados-personalizados/page';
describe('SimuladosPage (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<SimuladosPage />);
  });
}); 