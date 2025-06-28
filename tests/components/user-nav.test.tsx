import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from '@supabase/supabase-js';
import { UserNav } from '@/components/user-nav';
import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { useToast } from '@/src/features/shared/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Mock dependencies
vi.mock('@/src/features/auth/hooks/use-auth');
vi.mock('@/src/features/shared/hooks/use-toast');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);
const mockUseToast = vi.mocked(useToast);
const mockUseRouter = vi.mocked(useRouter);

// --- Mocks ---
const mockUser: User = {
  id: 'user-123',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test@example.com',
  phone: '',
  created_at: new Date().toISOString(),
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { name: 'Test User', avatar_url: '' },
  identities: [],
  factors: [],
};

const defaultAuthMock = {
  user: null,
  session: null,
  loading: false,
  initialized: true,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn().mockResolvedValue({ error: null }),
};

describe('UserNav Component', () => {
  const mockRouter = {
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };
  const mockToast = {
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseToast.mockReturnValue(mockToast);
    mockUseAuth.mockReturnValue(defaultAuthMock);
  });

  it('should render nothing when user is not logged in', () => {
    mockUseAuth.mockReturnValue({ ...defaultAuthMock, user: null });
    const { container } = render(<UserNav />);
    expect(container.firstChild).toBeNull();
  });

  it('should render a loading skeleton when loading', () => {
    mockUseAuth.mockReturnValue({ ...defaultAuthMock, loading: true });
    render(<UserNav />);
    expect(screen.getByTestId('user-nav-loading')).toBeInTheDocument();
  });

  it('should render user avatar and open dropdown on click', async () => {
    mockUseAuth.mockReturnValue({ ...defaultAuthMock, user: mockUser });
    render(<UserNav />);

    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('should navigate to settings on click', async () => {
    mockUseAuth.mockReturnValue({ ...defaultAuthMock, user: mockUser });
    render(<UserNav />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(await screen.findByText('Configurações'));

    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/configuracoes');
  });

  it('should call signOut on logout click', async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    mockUseAuth.mockReturnValue({ ...defaultAuthMock, user: mockUser, signOut });
    render(<UserNav />);

    await userEvent.click(screen.getByRole('button'));
    const logoutButton = await screen.findByText('Sair');
    await userEvent.click(logoutButton);

    await vi.waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
});
