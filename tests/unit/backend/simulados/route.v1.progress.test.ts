// tests para rotas v1 de simulados (progresso por slug)
// NOTA: Este é um placeholder de teste. Em um ambiente real, deve-se mockar o Supabase e o app Express.

import type { Request, Response } from 'express';
import { describe, it, expect, vi } from 'vitest';
import { progressBySlugSchema } from '../../../backend/src/api/simulados/schemas.ts';

describe('Simulados v1 - progresso por slug (validação)', () => {
  it('deve invalidar payload ausente/campos obrigatórios (400)', async () => {
    try {
      progressBySlugSchema.parse({});
      throw new Error('should not reach');
    } catch (err: any) {
      expect(String(err.message)).toContain('usuario_id');
      expect(String(err.message)).toContain('simulado_id');
    }
  });

  it('deve aceitar payload válido mínimo', async () => {
    const valid = {
      usuario_id: '44444444-4444-4444-4444-444444444444',
      simulado_id: '22222222-2222-2222-2222-222222222222',
      is_concluido: false,
    };
    expect(() => progressBySlugSchema.parse(valid)).not.toThrow();
  });
});


