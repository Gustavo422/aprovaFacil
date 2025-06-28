import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

// Mock child components to isolate the test to HomePage
vi.mock('@/components/sidebar-nav', () => ({
  SidebarNav: () => <div data-testid="sidebar-nav">SidebarNav</div>,
}));
vi.mock('@/components/user-nav', () => ({
  UserNav: () => <div data-testid="user-nav">UserNav</div>,
}));
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-content">{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('HomePage', () => {
  it('should render the main heading', () => {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', { name: /Bem-vindo ao AprovaFácil/i })
    ).toBeInTheDocument();
  });

  it('should render the UserNav and SidebarNav components', () => {
    render(<HomePage />);
    expect(screen.getByTestId('user-nav')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-nav')).toBeInTheDocument();
  });

  it('should render feature cards', () => {
    render(<HomePage />);
    expect(screen.getByText('Simulados')).toBeInTheDocument();
    expect(screen.getByText('Plano de Estudos')).toBeInTheDocument();
    expect(screen.getByText('Flashcards')).toBeInTheDocument();
  });
});
