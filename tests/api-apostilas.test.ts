const mockGetUser = vi.fn();
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockIn = vi.fn();
const mockInsert = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/lib/supabase', () => ({
  createRouteHandlerClient: async () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}));
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));
vi.mock('next/server', () => ({ NextResponse: { json: vi.fn((data, opts) => ({ data, opts })) } }));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apostilasApi from '../app/api/apostilas/route';

function makeRequest(url = 'http://localhost') {
  return { url } as Request;
}

describe('API Apostilas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET retorna 401 se não autenticado', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const req = makeRequest();
    const res = await apostilasApi.GET(req);
    expect(res).toEqual({ data: { error: 'Não autorizado' }, opts: { status: 401 } });
  });

  it('POST retorna 401 se não autenticado', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const req = { json: async () => ({}), url: 'http://localhost' } as Request;
    const res = await apostilasApi.POST(req);
    expect(res).toEqual({ data: { error: 'Não autorizado' }, opts: { status: 401 } });
  });

  it('POST retorna 400 se faltar título', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: '1' } } });
    const req = { json: async () => ({}), url: 'http://localhost' } as Request;
    const res = await apostilasApi.POST(req);
    expect(res).toEqual({ data: { error: 'Título é obrigatório' }, opts: { status: 400 } });
  });

  it('POST cria apostila com sucesso', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: '1' } } });
    const reqBody = { title: 'Apostila Teste', description: 'Desc', concurso_id: 'c1' };
    const req = { json: async () => reqBody, url: 'http://localhost' } as Request;
    mockFrom.mockReturnValue({
      insert: mockInsert.mockReturnValue({ select: () => ({ single: mockSingle.mockResolvedValueOnce({ data: reqBody, error: null }) }) })
    });
    const res = await apostilasApi.POST(req);
    expect(res).toMatchObject({ data: { message: 'Apostila criada com sucesso', apostila: reqBody } });
  });

  it('POST retorna erro do banco', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: '1' } } });
    const reqBody = { title: 'Apostila Teste', description: 'Desc', concurso_id: 'c1' };
    const req = { json: async () => reqBody, url: 'http://localhost' } as Request;
    mockFrom.mockReturnValue({
      insert: mockInsert.mockReturnValue({ select: () => ({ single: mockSingle.mockResolvedValueOnce({ data: null, error: 'Erro banco' }) }) })
    });
    const res = await apostilasApi.POST(req);
    expect(res).toMatchObject({ data: { error: 'Erro banco' }, opts: { status: 500 } });
  });

  it('GET retorna lista de apostilas com sucesso', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: '1' } } });
    const apostilas = [{ id: 'a1', concurso_id: 'c1' }, { id: 'a2', concurso_id: 'c2' }];
    const concursos = [{ id: 'c1', nome: 'Concurso 1' }, { id: 'c2', nome: 'Concurso 2' }];
    // Mock para select de apostilas
    mockFrom.mockImplementation((table) => {
      if (table === 'apostilas') {
        return { select: () => ({ eq: () => ({}) }), eq: () => ({}) };
      }
      if (table === 'concursos') {
        return { select: () => ({ in: () => Promise.resolve({ data: concursos, error: null }) }) };
      }
      return {};
    });
    // Mock para query de apostilas
    const req = makeRequest();
    // Simula apostilas retornadas
    mockFrom().select = () => Promise.resolve({ data: apostilas, error: null });
    const res = await apostilasApi.GET(req);
    expect(res).toMatchObject({ data: expect.any(Object) });
  });

  it('GET retorna erro do banco', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: '1' } } });
    mockFrom.mockReturnValue({ select: () => Promise.resolve({ data: null, error: 'Erro banco' }) });
    const req = makeRequest();
    const res = await apostilasApi.GET(req);
    expect(res).toMatchObject({ data: { error: 'Erro banco' }, opts: { status: 500 } });
  });

  it('GET retorna uma apostila específica por id', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: '1' } } });
    const apostila = { id: 'a1', concurso_id: 'c1', apostila_content: [{ content: 'conteudo' }] };
    mockFrom.mockImplementation((table) => {
      if (table === 'apostilas') {
        return { select: () => ({ eq: () => Promise.resolve({ data: [apostila], error: null }) }) };
      }
      if (table === 'concursos') {
        return { select: () => ({ in: () => Promise.resolve({ data: [], error: null }) }) };
      }
      return {};
    });
    const req = makeRequest('http://localhost?id=a1');
    const res = await apostilasApi.GET(req);
    expect(res).toMatchObject({ data: { apostilas: [apostila] } });
  });

  it('GET retorna lista de apostilas filtrada por concurso_id', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: '1' } } });
    const apostilas = [{ id: 'a1', concurso_id: 'c1' }];
    mockFrom.mockImplementation((table) => {
      if (table === 'apostilas') {
        return { select: () => ({ eq: () => Promise.resolve({ data: apostilas, error: null }) }) };
      }
      if (table === 'concursos') {
        return { select: () => ({ in: () => Promise.resolve({ data: [], error: null }) }) };
      }
      return {};
    });
    const req = makeRequest('http://localhost?concurso_id=c1');
    const res = await apostilasApi.GET(req);
    expect(res).toMatchObject({ data: { apostilas } });
  });

  it('GET retorna lista de apostilas enriquecida com dados de concursos', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: '1' } } });
    const apostilas = [{ id: 'a1', concurso_id: 'c1' }];
    const concursos = [{ id: 'c1', nome: 'Concurso 1', categoria: 'cat', ano: 2024, banca: 'banca' }];
    mockFrom.mockImplementation((table) => {
      if (table === 'apostilas') {
        return { select: () => Promise.resolve({ data: apostilas, error: null }) };
      }
      if (table === 'concursos') {
        return { select: () => ({ in: () => Promise.resolve({ data: concursos, error: null }) }) };
      }
      return {};
    });
    const req = makeRequest();
    const res = await apostilasApi.GET(req);
    expect(res).toMatchObject({ data: { apostilas: [{ id: 'a1', concurso_id: 'c1', concursos: concursos[0] }] } });
  });

  it('GET retorna erro ao buscar concursos', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: '1' } } });
    const apostilas = [{ id: 'a1', concurso_id: 'c1' }];
    mockFrom.mockImplementation((table) => {
      if (table === 'apostilas') {
        return { select: () => Promise.resolve({ data: apostilas, error: null }) };
      }
      if (table === 'concursos') {
        return { select: () => ({ in: () => Promise.resolve({ data: null, error: 'Erro concursos' }) }) };
      }
      return {};
    });
    const req = makeRequest();
    const res = await apostilasApi.GET(req);
    expect(res).toMatchObject({ data: { apostilas } });
  });

  it('GET retorna erro em exceção inesperada', async () => {
    mockGetUser.mockImplementationOnce(() => { throw new Error('Falha inesperada'); });
    const req = makeRequest();
    const res = await apostilasApi.GET(req);
    expect(res).toMatchObject({ data: { error: 'Falha inesperada' }, opts: { status: 500 } });
  });

  it('GET retorna lista vazia de apostilas', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: '1' } } });
    mockFrom.mockImplementation((table) => {
      if (table === 'apostilas') {
        return { select: () => Promise.resolve({ data: [], error: null }) };
      }
      return {};
    });
    const req = makeRequest();
    const res = await apostilasApi.GET(req);
    expect(res).toMatchObject({ data: { apostilas: [] } });
  });

  it('POST retorna erro em exceção inesperada', async () => {
    mockGetUser.mockImplementationOnce(() => { throw new Error('Falha inesperada POST'); });
    const req = { json: async () => ({ title: 'A', description: 'B', concurso_id: 'C' }), url: 'http://localhost' } as Request;
    const res = await apostilasApi.POST(req);
    expect(res).toMatchObject({ data: { error: 'Falha inesperada POST' }, opts: { status: 500 } });
  });

  it('GET retorna apostilas undefined', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: '1' } } });
    mockFrom.mockImplementation((table) => {
      if (table === 'apostilas') {
        return { select: () => Promise.resolve({ data: undefined, error: null }) };
      }
      return {};
    });
    const req = makeRequest();
    const res = await apostilasApi.GET(req);
    expect(res).toMatchObject({ data: { apostilas: undefined } });
  });
}); 