import { render } from '@testing-library/react';
import MapaMateriasClient from '@/app/dashboard/mapa-materias/mapa-materias-client';
describe('MapaMateriasClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<MapaMateriasClient />);
  });
});