import { render } from '@testing-library/react';
import MapaAssuntosPage from '@/app/dashboard/mapa-materias/page';
describe('MapaAssuntosPage (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<MapaAssuntosPage />);
  });
}); 