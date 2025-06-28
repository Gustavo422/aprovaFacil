import { render } from '@testing-library/react';
import DashboardClient from '@/app/dashboard/dashboard-client';
describe('DashboardClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<DashboardClient />);
  });
}); 