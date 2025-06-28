'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  objetivo: z.string().min(1, 'O objetivo é obrigatório'),
  horasPorDia: z.number().min(1, 'Deve ser pelo menos 1 hora').max(12, 'Máximo de 12 horas por dia'),
  diasPorSemana: z.number().min(1).max(7),
  materias: z.array(z.string()).min(1, 'Selecione pelo menos uma matéria'),
  dataProva: z.string().min(1, 'A data da prova é obrigatória'),
  nivelAtual: z.string().min(1, 'O nível atual é obrigatório'),
});

type PlanoEstudoFormValues = z.infer<typeof formSchema>;

interface PlanoEstudoFormProps {
  onSubmit?: (data: PlanoEstudoFormValues) => Promise<void>;
  onPlanoCriado?: (novoPlano: any) => void;
  defaultValues?: Partial<PlanoEstudoFormValues>;
  loading?: boolean;
}

export function PlanoEstudosInteligenteForm({
  onSubmit,
  onPlanoCriado,
  defaultValues,
  loading = false,
}: PlanoEstudoFormProps) {
  const form = useForm<PlanoEstudoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objetivo: '',
      horasPorDia: 2,
      diasPorSemana: 5,
      materias: [],
      dataProva: '',
      nivelAtual: '',
      ...defaultValues,
    },
  });

  const materias = [
    'Português',
    'Matemática',
    'Direito Constitucional',
    'Direito Administrativo',
    'Informática',
    'Raciocínio Lógico',
    'Atualidades',
  ];

  const niveis = [
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediario', label: 'Intermediário' },
    { value: 'avancado', label: 'Avançado' },
  ];

  const handleSubmit = async (data: PlanoEstudoFormValues) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else if (onPlanoCriado) {
        // Se não houvesse um onSubmit, mas houver onPlanoCriado, chama ele
        onPlanoCriado(data as any);
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="objetivo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Aprovação no concurso X"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Defina claramente seu objetivo principal com este plano de estudos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="horasPorDia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horas por dia</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diasPorSemana"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dias por semana</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={7}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dataProva"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da Prova</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nivelAtual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível Atual</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu nível atual" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {niveis.map((nivel) => (
                    <SelectItem key={nivel.value} value={nivel.value}>
                      {nivel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="materias"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Matérias</FormLabel>
                <FormDescription>
                  Selecione as matérias que deseja incluir no seu plano de estudos.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {materias.map((materia) => (
                  <div key={materia} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={materia}
                      checked={form.watch('materias')?.includes(materia)}
                      onChange={(e) => {
                        const currentMaterias = form.getValues('materias') || [];
                        if (e.target.checked) {
                          form.setValue('materias', [...currentMaterias, materia]);
                        } else {
                          form.setValue(
                            'materias',
                            currentMaterias.filter((m) => m !== materia)
                          );
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={materia}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {materia}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={loading}
          >
            Limpar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Plano de Estudos'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PlanoEstudosInteligenteForm;
