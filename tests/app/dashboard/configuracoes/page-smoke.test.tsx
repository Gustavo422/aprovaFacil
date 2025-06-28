import { render } from '@testing-library/react';
import { vi } from 'vitest';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => ({ get: vi.fn() }),
}));
import ConfiguracoesPage from '@/app/dashboard/configuracoes/page';
describe('ConfiguracoesPage (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<ConfiguracoesPage />);
  });
}); 