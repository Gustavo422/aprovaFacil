'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import type { PlanoEstudo } from '@/src/core/database/types';

interface PlanoEstudosFormProps {
  onPlanoCriado: (plano: PlanoEstudo) => void;
}

export function PlanoEstudosForm({ onPlanoCriado }: PlanoEstudosFormProps) {
  const [concursoId, setConcursoId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/plano-estudos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concursoId: concursoId || null,
          startDate,
          endDate,
          hoursPerDay: Number(hoursPerDay),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar plano de estudos');
      }

      toast.success('Seu plano de estudos foi criado com sucesso!');
      onPlanoCriado(data.planoEstudo);
    } catch (error) {
      logger.error('Erro no formulário de plano de estudos', {
        error: error instanceof Error ? error.message : String(error),
      });
      toast.error(
        error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="concursoId">ID do Concurso (Opcional)</Label>
        <Input
          id="concursoId"
          value={concursoId}
          onChange={e => setConcursoId(e.target.value)}
          placeholder="Deixe em branco para um plano geral"
        />
      </div>
      <div>
        <Label htmlFor="startDate">Data de Início</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="endDate">Data de Fim</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="hoursPerDay">Horas de Estudo por Dia</Label>
        <Input
          id="hoursPerDay"
          type="number"
          value={hoursPerDay}
          onChange={e => setHoursPerDay(e.target.value)}
          required
          min="1"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Plano'}
      </Button>
    </form>
  );
}