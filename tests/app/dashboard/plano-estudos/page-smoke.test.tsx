import { render } from '@testing-library/react';
import PlanoEstudosPage from '@/app/dashboard/plano-estudos-inteligente/page';
describe('PlanoEstudosPage (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<PlanoEstudosPage />);
  });
}); 