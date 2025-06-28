-- Adiciona a coluna last_login à tabela users
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS last_login timestamp with time zone;

-- Comentário explicativo
COMMENT ON COLUMN public.users.last_login IS 'Data e hora do último login do usuário';
