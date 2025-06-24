import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signInLogic } from '../app/actions/auth-logic';

// Mocks
const mockSignInWithPassword = vi.fn();
const mockUpdate = vi.fn();
const mockLogLogin = vi.fn();
const mockRedirect = vi.fn();

vi.mock('next/navigation', () => ({ redirect: mockRedirect }));
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));
vi.mock('@/lib/audit', () => ({ getAuditLogger: () => ({ logLogin: mockLogLogin }) }));
vi.mock('@/lib/supabase', () => ({ createServerSupabaseClient: async () => ({ from: () => ({ update: mockUpdate, eq: () => ({}) }) }) }));
vi.mock('@supabase/auth-helpers-nextjs', () => ({ createServerActionClient: () => ({ auth: { signInWithPassword: mockSignInWithPassword } }) }));
vi.mock('next/headers', () => ({ cookies: {} }));

import * as authActions from '../app/actions/auth';

function makeFormData(email: string, password: string) {
  return {
    get: (key: string) => (key === 'email' ? email : key === 'password' ? password : undefined),
  } as unknown as FormData;
}

describe('signInLogic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar sucesso em login bem-sucedido', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ data: { user: { id: '1' } }, error: null });
    const mockEq = vi.fn();
    mockUpdate.mockReturnValue({ eq: mockEq });

    const result = await signInLogic('user@email.com', 'senha123', {
      supabase: { auth: { signInWithPassword: mockSignInWithPassword } } as unknown as import('@supabase/supabase-js').SupabaseClient,
      serverClient: { from: () => ({ update: mockUpdate }) } as unknown as import('@supabase/supabase-js').SupabaseClient,
      auditLogger: { logLogin: mockLogLogin } as unknown as import('@/lib/audit').AuditLogger,
    });

    expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: 'user@email.com', password: 'senha123' });
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', '1');
    expect(mockLogLogin).toHaveBeenCalledWith('1');
    expect(result).toEqual({ success: true });
  });

  it('deve retornar erro se as credenciais estiverem erradas', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ data: {}, error: { message: 'Credenciais inválidas' } });

    const result = await signInLogic('user@email.com', 'senhaerrada', {
      supabase: { auth: { signInWithPassword: mockSignInWithPassword } } as unknown as import('@supabase/supabase-js').SupabaseClient,
      serverClient: { from: () => ({ update: mockUpdate }) } as unknown as import('@supabase/supabase-js').SupabaseClient,
      auditLogger: { logLogin: mockLogLogin } as unknown as import('@/lib/audit').AuditLogger,
    });

    expect(result).toEqual({ error: 'Credenciais inválidas' });
    expect(mockLogLogin).not.toHaveBeenCalled();
  });
}); 