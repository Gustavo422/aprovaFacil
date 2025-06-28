import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardLayoutClient from '@/app/dashboard/dashboard-layout-client';

// Mock dependencies and child components
vi.mock('@/components/auth-guard', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-guard">{children}</div>,
}));
vi.mock('@/components/sidebar-nav', () => ({
  SidebarNav: () => <div data-testid="sidebar-nav">SidebarNav</div>,
}));
vi.mock('@/components/user-nav', () => ({
  UserNav: () => <div data-testid="user-nav">UserNav</div>,
}));

describe('DashboardLayoutClient', () => {
  it('should render within an AuthGuard', () => {
    render(<DashboardLayoutClient><div>Dashboard Page</div></DashboardLayoutClient>);
    expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
  });

  it('should render the main structure and toggle sidebar', async () => {
    const user = userEvent.setup();
    render(<DashboardLayoutClient><div>Dashboard Page</div></DashboardLayoutClient>);

    // Check for always-visible components
    expect(screen.getByTestId('user-nav')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();

    // Sidebar should be hidden initially
    expect(screen.queryByTestId('sidebar-nav')).not.toBeInTheDocument();

    // Find and click the menu button
    const menuButton = screen.getByRole('button', { name: /abrir menu/i });
    await user.click(menuButton);

    // Now the sidebar should be visible
    expect(screen.getByTestId('sidebar-nav')).toBeInTheDocument();
  });
});
