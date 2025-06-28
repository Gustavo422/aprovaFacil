import { render } from '@testing-library/react';
import FlashcardsClient from '@/app/dashboard/cartoes-memorizacao/flashcards-client';

describe('FlashcardsClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<FlashcardsClient cartoesMemorizacao={[]} />);
  });
});