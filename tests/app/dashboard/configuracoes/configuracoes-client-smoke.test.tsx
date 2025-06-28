import { render } from '@testing-library/react';
import { vi } from 'vitest';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => ({ get: vi.fn() }),
}));
import ConfiguracoesClient from '@/app/dashboard/configuracoes/configuracoes-client';

describe('ConfiguracoesClient (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<ConfiguracoesClient />);
  });
}); 