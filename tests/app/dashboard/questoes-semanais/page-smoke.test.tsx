import { render } from '@testing-library/react';
import QuestoesSemanaPage from '@/app/dashboard/100-questoes/page';
describe('QuestoesSemanaPage (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<QuestoesSemanaPage />);
  });
}); 