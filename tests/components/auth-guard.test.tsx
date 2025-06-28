import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { useRouter } from 'next/navigation';

vi.mock('@/src/features/auth/hooks/use-auth');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

const mockUseAuth = useAuth as any;
const mockUseRouter = useRouter as any;

describe('AuthGuard Component', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
  });

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ user: { id: '123' }, loading: false });
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render fallback when loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    render(
      <AuthGuard fallback={<div>Loading...</div>}>
        <div>Protected Content</div>
      </AuthGuard>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to /login when user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/dashboard',
      },
      writable: true,
    });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login?redirectedFrom=%2Fdashboard');
    });

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
