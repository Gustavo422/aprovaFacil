# Arquitetura do Sistema - Study App

## Visão Geral

Este documento descreve a arquitetura refatorada do sistema de estudo, baseada em **Domain-Driven Design (DDD)** com separação clara de responsabilidades e aplicação de princípios SOLID.

## Princípios Arquiteturais

### 1. **Domain-Driven Design (DDD)**
- Organização por domínios de negócio
- Linguagem ubíqua entre código e negócio
- Separação clara entre domínios

### 2. **Clean Architecture**
- Separação em camadas bem definidas
- Dependências apontam para dentro
- Inversão de dependência

### 3. **SOLID Principles**
- **S**ingle Responsibility: Cada classe tem uma responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Substituição de implementações
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Depender de abstrações

## Estrutura de Diretórios

```
src/
├── core/                          # Camada de domínio
│   ├── database/                  # Acesso a dados
│   │   ├── repositories/          # Repositórios específicos
│   │   ├── types/                 # Tipos TypeScript
│   │   ├── validation/            # Schemas Zod
│ │   └── base-repository.ts     # Repositório base
│   ├── services/                  # Lógica de negócio
│   │   ├── simulados/             # Serviços de simulados
│   │   ├── flashcards/            # Serviços de flashcards
│   │   ├── apostilas/             # Serviços de apostilas
│   │   └── dashboard/             # Serviços de dashboard
│   └── utils/                     # Utilitários
│       ├── logger.ts              # Sistema de logging
│       └── cache.ts               # Sistema de cache
├── features/                      # Funcionalidades da aplicação
│   ├── simulados/                 # Domínio simulados
│   │   ├── components/            # Componentes React
│   │   ├── hooks/                 # Hooks customizados
│   │   └── pages/                 # Páginas
│   ├── flashcards/                # Domínio flashcards
│   ├── apostilas/                 # Domínio apostilas
│   └── dashboard/                 # Domínio dashboard
└── shared/                        # Código compartilhado
    ├── components/                # Componentes genéricos
    ├── hooks/                     # Hooks genéricos
    └── types/                     # Tipos compartilhados
```

## Camadas da Arquitetura

### 1. **Camada de Apresentação (View)**
- **Responsabilidade**: Interface do usuário
- **Localização**: `src/features/*/components/` e `src/features/*/pages/`
- **Características**:
  - Componentes React funcionais
  - Hooks customizados para lógica de UI
  - Separação por domínios

### 2. **Camada de Lógica (Services/Hooks)**
- **Responsabilidade**: Lógica de negócio e orquestração
- **Localização**: `src/core/services/` e `src/features/*/hooks/`
- **Características**:
  - Serviços com lógica de negócio
  - Hooks para integração com UI
  - Validação de dados
  - Tratamento de erros

### 3. **Camada de Dados (Repositories)**
- **Responsabilidade**: Acesso e persistência de dados
- **Localização**: `src/core/database/repositories/`
- **Características**:
  - Repositórios específicos por domínio
  - Herança de BaseRepository
  - Validação com Zod
  - Cache inteligente
  - Logging estruturado

## Padrões Implementados

### 1. **Repository Pattern**
```typescript
// Exemplo: SimuladosRepository
export class SimuladosRepository extends BaseRepository<Simulado, SimuladoInsert, SimuladoUpdate> {
  async findAllWithConcurso(page: number, limit: number, filters?: Record<string, any>) {
    // Implementação específica
  }
}
```

### 2. **Factory Pattern**
```typescript
// Exemplo: Criação de repositórios
export class RepositoryFactory {
  static createSimuladosRepository(supabase: SupabaseClient): SimuladosRepository {
    return new SimuladosRepository(supabase);
  }
}
```

### 3. **Adapter Pattern**
```typescript
// Exemplo: Adaptação de dados do Supabase
export class SupabaseAdapter {
  static adaptSimulado(data: any): Simulado {
    // Transformação de dados
  }
}
```

## Validação de Dados

### Zod Schemas
```typescript
export const simuladoInsertSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  questions_count: z.number().min(1, 'Deve ter pelo menos 1 questão'),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil']),
  // ...
});
```

### Validação nos Repositórios
```typescript
async create(data: SimuladoInsert): Promise<Simulado> {
  const validatedData = validateData(simuladoInsertSchema, data);
  // ...
}
```

## Sistema de Cache

### Estratégias de Cache
- **Simulados**: 10 minutos (dados que mudam pouco)
- **Flashcards**: 15 minutos (conteúdo estável)
- **Apostilas**: 30 minutos (conteúdo muito estável)
- **Progresso do Usuário**: 5 minutos (dados pessoais)

### Invalidação Inteligente
```typescript
private invalidateCache(simuladoId?: string): void {
  simuladosCache.clear();
  if (simuladoId) {
    simuladosCache.delete(createCacheKey('simulados:with-questions', simuladoId));
  }
}
```

## Sistema de Logging

### Logs Estruturados
```typescript
logger.dbQuery('findAllWithConcurso', this.tableName, duration, {
  page,
  limit,
  filters,
  resultCount: data?.length || 0,
});
```

### Níveis de Log
- **ERROR**: Erros críticos
- **WARN**: Avisos importantes
- **INFO**: Informações gerais
- **DEBUG**: Detalhes de desenvolvimento

## Testes

### Estrutura de Testes
```
src/core/database/repositories/__tests__/
├── simulados-repository.test.ts
├── apostilas-repository.test.ts
└── flashcards-repository.test.ts
```

### Padrão de Testes
```typescript
describe('SimuladosRepository', () => {
  it('should call findAllWithContent without error', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Migrations e Constraints

### Constraints de Banco
```sql
-- Validação de enum
ALTER TABLE simulados 
ADD CONSTRAINT check_difficulty 
CHECK (difficulty IN ('Fácil', 'Médio', 'Difícil'));

-- Validação de valores
ALTER TABLE user_simulado_progress 
ADD CONSTRAINT check_score 
CHECK (score >= 0 AND score <= 100);
```

### Índices para Performance
```sql
CREATE INDEX IF NOT EXISTS idx_simulados_concurso_id ON simulados(concurso_id);
CREATE INDEX IF NOT EXISTS idx_simulados_created_by ON simulados(created_by);
```

## Benefícios da Nova Arquitetura

### 1. **Manutenibilidade**
- Código organizado por domínios
- Responsabilidades bem definidas
- Fácil localização de funcionalidades

### 2. **Escalabilidade**
- Adição de novos domínios sem afetar existentes
- Cache inteligente para performance
- Repositórios independentes

### 3. **Testabilidade**
- Separação clara de responsabilidades
- Mocks simples e eficazes
- Testes unitários focados

### 4. **Performance**
- Cache em múltiplas camadas
- Índices otimizados no banco
- Logging de performance

### 5. **Robustez**
- Validação de dados com Zod
- Constraints no banco de dados
- Tratamento de erros estruturado

## Próximos Passos

### 1. **Implementações Pendentes**
- [ ] Aplicar cache nos outros repositórios
- [ ] Implementar testes para todos os domínios
- [ ] Adicionar validação Zod em todos os repositórios

### 2. **Melhorias Futuras**
- [ ] Sistema de eventos para comunicação entre domínios
- [ ] Implementar CQRS para operações complexas
- [ ] Adicionar métricas de performance
- [ ] Implementar rate limiting

### 3. **Monitoramento**
- [ ] Dashboard de métricas
- [ ] Alertas de performance
- [ ] Logs centralizados

## Conclusão

A nova arquitetura implementa os princípios de DDD e Clean Architecture, resultando em um código mais organizado, testável e escalável. A separação por domínios facilita a manutenção e evolução do sistema, enquanto o sistema de cache e logging melhora a performance e observabilidade. 