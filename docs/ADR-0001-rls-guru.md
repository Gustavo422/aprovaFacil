# ADR-0001: Políticas RLS para o módulo Guru

- Status: Aceita
- Data: 2025-08-10

## Contexto
O módulo Guru lê progresso/atividades do usuário. Para garantir segurança e isolamento, adotamos RLS por `usuario_id = auth.uid()` nas tabelas e views.

## Decisão
- Tabelas de origem: políticas `SELECT/INSERT/UPDATE` restritas a `usuario_id = auth.uid()` quando aplicável.
- Views `v_guru_*`: aplicam RLS herdado; agregações respeitam usuário atual.
- Materialized views `mv_guru_*`: atualizadas por tarefa privilegiada; expostas via views `v_guru_*` com RLS.

## Consequências
- Segurança forte por padrão.
- Necessidade de seeds/testes cobrindo cenários allow/deny.
- Operações de refresh das MVs devem ocorrer com usuário privilegiado (jobs Supabase) e as views públicas não devem expor dados sem filtro de usuário.

