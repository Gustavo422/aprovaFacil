'use client';

import { Loader2, CheckCircle, Clock, Circle, ChevronDown, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

// Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Types
export interface Materia {
  id: string;
  nome: string;
  progresso: number;
  temas: Tema[];
}

export interface Tema {
  id: string;
  nome: string;
  status: 'pendente' | 'em-andamento' | 'concluido';
  subtemas?: string[];
}

// Componente para exibir o status de um tema
const StatusBadge = ({ status }: { status: Tema['status'] }) => {
  const statusConfig = {
    pendente: { 
      text: 'Pendente', 
      icon: <Circle className="h-3 w-3 text-yellow-500" />, 
      bg: 'bg-yellow-100 text-yellow-800' 
    },
    'em-andamento': { 
      text: 'Em Andamento', 
      icon: <Clock className="h-3 w-3 text-blue-500" />, 
      bg: 'bg-blue-100 text-blue-800' 
    },
    concluido: { 
      text: 'Concluído', 
      icon: <CheckCircle className="h-3 w-3 text-green-500" />, 
      bg: 'bg-green-100 text-green-800' 
    },
  };

  const config = statusConfig[status] || statusConfig.pendente;

  return (
    <Badge className={cn('inline-flex items-center gap-1', config.bg)}>
      {config.icon}
      {config.text}
    </Badge>
  );
};

export default function MapaMateriasClient() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMaterias, setExpandedMaterias] = useState<Record<string, boolean>>({});

  useEffect(() => {
    carregarMapaMaterias();
  }, []);

  const carregarMapaMaterias = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mapa-materias');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar o mapa de matérias');
      }
      
      const data = await response.json();
      setMaterias(data.materias || []);
      
      // Inicializa o estado de expansão para cada matéria
      const initialExpandedState = (data.materias || []).reduce((acc: Record<string, boolean>, materia: Materia) => {
        acc[materia.id] = false;
        return acc;
      }, {});
      
      setExpandedMaterias(initialExpandedState);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      logger.error('Erro ao carregar mapa de matérias', { error: errorMessage });
      setError('Não foi possível carregar o mapa de matérias. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleMateria = (materiaId: string) => {
    setExpandedMaterias(prev => ({
      ...prev,
      [materiaId]: !prev[materiaId]
    }));
  };
  
  const atualizarStatusTema = async (materiaId: string, temaId: string, novoStatus: Tema['status']) => {
    try {
      // Atualização otimista
      setMaterias(prevMaterias => 
        prevMaterias.map(materia => 
          materia.id === materiaId
            ? {
                ...materia,
                temas: materia.temas.map(tema => 
                  tema.id === temaId ? { ...tema, status: novoStatus } : tema
                ),
                progresso: calcularProgresso(
                  materia.temas.map(t => 
                    t.id === temaId ? { ...t, status: novoStatus } : t
                  )
                )
              }
            : materia
        )
      );
      
      // Chamada à API
      const response = await fetch('/api/mapa-materias/atualizar-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materiaId, temaId, status: novoStatus })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar o status');
      }
      
    } catch (err) {
      // Reverter em caso de erro
      carregarMapaMaterias();
      logger.error('Erro ao atualizar status do tema', { error: err });
    }
  };
  
  // Função para calcular o progresso de uma matéria
  const calcularProgresso = (temas: Tema[]): number => {
    if (temas.length === 0) return 0;
    const concluidos = temas.filter(tema => tema.status === 'concluido').length;
    return Math.round((concluidos / temas.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Carregando mapa de matérias...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4">
        <p className="text-destructive">{error}</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={carregarMapaMaterias}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Mapa de Matérias</h2>
        <Button variant="outline" onClick={carregarMapaMaterias}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {materias.map((materia) => (
          <Card key={materia.id} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleMateria(materia.id)}
            >
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{materia.nome}</CardTitle>
                <ChevronDown 
                  className={cn(
                    'h-5 w-5 text-muted-foreground transition-transform',
                    expandedMaterias[materia.id] ? 'rotate-180' : ''
                  )} 
                />
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">{materia.progresso}%</span>
                </div>
                <Progress value={materia.progresso} className="h-2" />
              </div>
            </CardHeader>
            
            <AnimatePresence>
              {expandedMaterias[materia.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {materia.temas.map((tema) => (
                        <div key={tema.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{tema.nome}</h3>
                            <StatusBadge status={tema.status} />
                          </div>
                          
                          {tema.subtemas && tema.subtemas.length > 0 && (
                            <ul className="mt-2 space-y-1 pl-4 text-sm text-muted-foreground">
                              {tema.subtemas.map((subtema, index) => (
                                <li key={index} className="flex items-center">
                                  <Circle className="h-2 w-2 mr-2 text-muted-foreground" />
                                  {subtema}
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          <div className="mt-3 flex gap-2">
                            <Button
                              variant={tema.status === 'pendente' ? 'default' : 'outline'}
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => atualizarStatusTema(materia.id, tema.id, 'pendente')}
                            >
                              <Circle className="h-3 w-3 mr-1" />
                              Pendente
                            </Button>
                            <Button
                              variant={tema.status === 'em-andamento' ? 'default' : 'outline'}
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => atualizarStatusTema(materia.id, tema.id, 'em-andamento')}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Em Andamento
                            </Button>
                            <Button
                              variant={tema.status === 'concluido' ? 'default' : 'outline'}
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => atualizarStatusTema(materia.id, tema.id, 'concluido')}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Concluído
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
}
