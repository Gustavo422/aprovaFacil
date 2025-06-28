import { render } from '@testing-library/react';
import FlashcardsPage from '@/app/dashboard/cartoes-memorizacao/page';
describe('FlashcardsPage (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<FlashcardsPage />);
  });
}); 