import { render, screen, fireEvent } from '@testing-library/react';
import { ExportJsonButton } from '@/components/ui/export-json-button';

describe('ExportJsonButton', () => {
  it('renderiza o botão e dispara o clique', () => {
    render(<ExportJsonButton data={{}} filename="teste" />);
    const button = screen.getByRole('button', { name: /exportar json/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
  });
}); 