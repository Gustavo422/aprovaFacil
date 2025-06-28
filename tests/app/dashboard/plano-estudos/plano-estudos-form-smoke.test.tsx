import { render } from '@testing-library/react';
import { PlanoEstudosForm } from '@/app/dashboard/plano-estudos-inteligente/plano-estudos-form';

describe('PlanoEstudosForm (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<PlanoEstudosForm onPlanoCriado={() => {}} />);
  });
}); 