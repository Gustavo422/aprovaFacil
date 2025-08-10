# ADR-0002: Estratégia de Cache para o módulo Guru

- Status: Aceita
- Data: 2025-08-10

## Contexto
Os endpoints do dashboard agregam dados de múltiplas fontes e podem ser custosos. Precisamos de cache por usuário (e concurso quando aplicável) com TTL curto.

## Decisão
- Chaves: `guru:enhanced-stats:user:{usuarioId}[:concurso:{concursoId}]`, `guru:activities:user:{usuarioId}[:concurso:{concursoId}]:limit:{n}`.
- TTL: stats 5 minutos; activities 2 minutos.
- Invalidação: por dependências (`usuario`, `concurso`).

## Consequências
- Redução de latência e carga de banco.
- Consistência eventual de poucos minutos é aceitável para o dashboard.

