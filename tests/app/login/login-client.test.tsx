import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginClient from '@/app/login/login-client';

const push = vi.fn();
const toast = vi.fn();

vi.mock('@/src/features/auth/hooks/use-auth', () => ({
  useAuth: () => ({ user: null, loading: false })
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({ get: vi.fn() })
}));
vi.mock('@/src/features/shared/hooks/use-toast', () => ({
  useToast: () => ({ toast })
}));

describe('LoginClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o formulário de login', () => {
    render(<LoginClient />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve mostrar erro se o e-mail for inválido', async () => {
    render(<LoginClient />);
    fireEvent.input(screen.getByLabelText(/e-mail/i), { target: { value: 'invalido' } });
    fireEvent.input(screen.getByPlaceholderText('••••••••'), { target: { value: '123456' } });
    fireEvent.submit(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/e-mail válido/i)).toBeInTheDocument();
  });

  it('deve mostrar erro se a senha for muito curta', async () => {
    render(<LoginClient />);
    fireEvent.input(screen.getByLabelText(/e-mail/i), { target: { value: 'teste@email.com' } });
    fireEvent.input(screen.getByPlaceholderText('••••••••'), { target: { value: '123' } });
    fireEvent.submit(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/pelo menos 6 caracteres/i)).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro ao receber resposta inválida da API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: 'Credenciais inválidas' } })
    });
    render(<LoginClient />);
    fireEvent.input(screen.getByLabelText(/e-mail/i), { target: { value: 'teste@email.com' } });
    fireEvent.input(screen.getByPlaceholderText('••••••••'), { target: { value: '123456' } });
    fireEvent.submit(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(toast).toHaveBeenCalled();
    });
  });

  it('deve redirecionar após login bem-sucedido', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });
    render(<LoginClient />);
    fireEvent.input(screen.getByLabelText(/e-mail/i), { target: { value: 'teste@email.com' } });
    fireEvent.input(screen.getByPlaceholderText('••••••••'), { target: { value: '123456' } });
    fireEvent.submit(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(push).toHaveBeenCalled();
    });
  });
}); 