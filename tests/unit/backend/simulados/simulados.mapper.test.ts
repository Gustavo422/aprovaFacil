import { describe, it, expect } from 'vitest';
import { toSimuladoListItemDTO, toSimuladoDetailDTO, toQuestaoSimuladoDTO } from '../../../../backend/src/modules/simulados/mappers/simulados.mapper.ts';

describe('Simulados mappers', () => {
  it('toSimuladoListItemDTO deve mapear apenas campos conhecidos e tolerar desconhecidos', () => {
    const dto = toSimuladoListItemDTO({
      id: '1',
      titulo: 'T',
      slug: 's',
      descricao: null,
      concurso_id: 'c1',
      categoria_id: 'cat1',
      numero_questoes: 10,
      tempo_minutos: 60,
      dificuldade: 'medio',
      disciplinas: { a: 1 },
      publico: true,
      ativo: true,
      atualizado_em: '2024-01-01T00:00:00.000Z',
      extra_col: 'ignore',
    } as any);
    expect(dto.slug).toBe('s');
    expect((dto as any).extra_col).toBeUndefined();
  });

  it('toSimuladoDetailDTO deve incluir criado_por e criado_em', () => {
    const dto = toSimuladoDetailDTO({
      id: '1', titulo: 'T', slug: 's', numero_questoes: 1, tempo_minutos: 30, dificuldade: 'medio',
      atualizado_em: '2024-01-01T00:00:00.000Z', criado_em: '2024-01-01T00:00:00.000Z', criado_por: 'u1', publico: true, ativo: true,
    } as any);
    expect(dto.criado_por).toBe('u1');
    expect(dto.criado_em).toBeTypeOf('string');
  });

  it('toQuestaoSimuladoDTO deve mapear campos principais e normalizar opcionais', () => {
    const dto = toQuestaoSimuladoDTO({
      id: 'q1', simulado_id: 's1', numero_questao: 1, enunciado: 'E', alternativas: { a: 'A' }, resposta_correta: 'a',
      explicacao: null, disciplina: null, dificuldade: 'medio', ativo: true, criado_em: 'x', atualizado_em: 'y',
    } as any);
    expect(dto.id).toBe('q1');
    expect(dto.numero_questao).toBe(1);
    expect(dto.disciplina).toBeNull();
  });
});


