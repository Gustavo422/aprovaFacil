import { render } from '@testing-library/react';
import { vi } from 'vitest';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => ({ get: vi.fn() }),
}));
import SimuladoSlugPage from '@/app/dashboard/simulados-personalizados/[slug]/page';
describe('SimuladoSlugPage (smoke)', () => {
  it('renderiza sem crashar', () => {
    render(<SimuladoSlugPage params={{ slug: 'teste-slug' }} />);
  });
}); 