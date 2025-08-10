# ADR-0003: Versionamento de API para o módulo Guru

- Status: Aceita
- Data: 2025-08-10

## Contexto
Precisamos evoluir contratos sem quebrar o frontend e manter compatibilidade temporária com rotas legadas.

## Decisão
- Endpoints estáveis sob `/api/guru/v1/...`.
- Manter rotas legadas durante janela de depreciação, marcadas como `deprecated` no OpenAPI.
- SemVer aplicável aos contratos do módulo: `v1.x` para mudanças backward-compatible; `v2` para breaking changes.

## Consequências
- Facilita rollout/rollback.
- Documentação e testes de contrato garantem compatibilidade entre versões.

