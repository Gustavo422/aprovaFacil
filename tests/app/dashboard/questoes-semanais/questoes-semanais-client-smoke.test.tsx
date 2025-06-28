import { render } from '@testing-library/react';
import QuestoesSemanaClient from '@/app/dashboard/100-questoes/questoes-semanais-client';
describe('QuestoesSemanaClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<QuestoesSemanaClient />);
  });
}); 