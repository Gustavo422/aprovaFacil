import { describe, it, expect } from 'vitest';
import { computeListEtag, computeQuestoesEtag, computeSimuladoDetailEtag } from '../../../../backend/src/api/simulados/etag.ts';

describe('ETag utilities (simulados)', () => {
  it('computeListEtag: compõe ETag fraca com parâmetros chave', () => {
    const etag = computeListEtag({
      concursoId: 'c1',
      page: 2,
      limit: 20,
      dificuldade: 'medio',
      search: 'abc',
      status: 'finalizado',
      lastUpdated: '2024-01-01T00:00:00.000Z',
    });
    expect(etag.startsWith('W/"list:')).toBe(true);
    expect(etag).toContain('c1:2:20:medio:abc:finalizado:2024-01-01T00:00:00.000Z');
  });

  it('computeSimuladoDetailEtag: usa revisões meta e questões', () => {
    expect(computeSimuladoDetailEtag(3, 5)).toBe('W/"m:3|q:5"');
    expect(computeSimuladoDetailEtag(undefined, undefined)).toBe('W/"m:0|q:0"');
  });

  it('computeQuestoesEtag: usa revisão de questões', () => {
    expect(computeQuestoesEtag(7)).toBe('W/"q:7"');
    expect(computeQuestoesEtag(undefined)).toBe('W/"q:0"');
  });
});


