import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { getSimuladoBySlugHandler } from '../../../backend/src/api/simulados/route.ts';

// Stub service via module mock
vi.mock('../../../backend/src/modules/simulados/services/simulados.service.ts', () => {
  return {
    SimuladosService: class {
      async buscarDetalhePorSlug(slug: string) {
        if (slug === 'not-found') {
          const err: any = new Error('Simulado não encontrado');
          err.status = 404;
          throw err;
        }
        return {
          id: 's1', slug, titulo: 'T', descricao: null, numero_questoes: 10, tempo_minutos: 60,
          meta_revision: 1, questoes_revision: 2, atualizado_em: '2024-01-01T00:00:00.000Z', publico: true, ativo: true,
        } as any;
      }
    },
  };
});

function createReq(params: Record<string, string>, headers: Record<string, string> = {}, url = '/api/v1/simulados/:slug'): Request {
  return {
    params,
    headers,
    get: (k: string) => headers[k.toLowerCase()] ?? undefined,
    originalUrl: url,
  } as unknown as Request;
}

function createRes(): Response {
  const headers: Record<string, string> = {};
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
    setHeader: (k: string, v: string) => { headers[k] = v; },
    getHeaders: () => headers,
  } as unknown as Response;
}

describe('GET /api/v1/simulados/:slug (handler)', () => {
  beforeEach(() => vi.resetAllMocks());

  it('retorna 304 quando ETag/If-None-Match coincide', async () => {
    const req = createReq({ slug: 'a' }, { 'if-none-match': 'W/"m:1|q:2"' });
    const res = createRes();
    await getSimuladoBySlugHandler(req as any, res as any);
    expect((res as any).status).toHaveBeenCalledWith(304);
  });
});


