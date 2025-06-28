import { render } from '@testing-library/react';
import { vi } from 'vitest';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => ({ get: vi.fn() }),
}));
import DashboardLayoutClient from '@/app/dashboard/dashboard-layout-client';

describe('DashboardLayoutClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<DashboardLayoutClient>conteúdo de teste</DashboardLayoutClient>);
  });
}); 