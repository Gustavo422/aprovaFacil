import { render } from '@testing-library/react';
import PlanoEstudosClient from '@/app/dashboard/plano-estudos-inteligente/plano-estudos-client';

describe('PlanoEstudosClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<PlanoEstudosClient />);
  });
}); 