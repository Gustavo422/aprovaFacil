-- Script para configurar as Foreign Keys que estão faltando
-- Execute este script no seu Supabase SQL Editor

-- Função para verificar se uma constraint existe
CREATE OR REPLACE FUNCTION constraint_exists(constraint_name text, table_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        WHERE tc.constraint_name = $1 
        AND tc.table_name = $2 
        AND tc.table_schema = 'public'
    );
END;
$$ LANGUAGE plpgsql;

-- 1. Adicionar Foreign Key para apostilas.concurso_id (se não existir)
DO $$
BEGIN
    IF NOT constraint_exists('fk_apostilas_concurso', 'apostilas') THEN
        ALTER TABLE public.apostilas 
        ADD CONSTRAINT fk_apostilas_concurso 
        FOREIGN KEY (concurso_id) REFERENCES public.concursos(id);
        RAISE NOTICE 'Foreign key fk_apostilas_concurso criada';
    ELSE
        RAISE NOTICE 'Foreign key fk_apostilas_concurso já existe';
    END IF;
END $$;

-- 2. Adicionar Foreign Key para simulados.concurso_id (se não existir)
DO $$
BEGIN
    IF NOT constraint_exists('fk_simulados_concurso', 'simulados') THEN
        ALTER TABLE public.simulados 
        ADD CONSTRAINT fk_simulados_concurso 
        FOREIGN KEY (concurso_id) REFERENCES public.concursos(id);
        RAISE NOTICE 'Foreign key fk_simulados_concurso criada';
    ELSE
        RAISE NOTICE 'Foreign key fk_simulados_concurso já existe';
    END IF;
END $$;

-- 3. Adicionar Foreign Key para simulado_questions.concurso_id (se não existir)
DO $$
BEGIN
    IF NOT constraint_exists('fk_simulado_questions_concurso', 'simulado_questions') THEN
        ALTER TABLE public.simulado_questions 
        ADD CONSTRAINT fk_simulado_questions_concurso 
        FOREIGN KEY (concurso_id) REFERENCES public.concursos(id);
        RAISE NOTICE 'Foreign key fk_simulado_questions_concurso criada';
    ELSE
        RAISE NOTICE 'Foreign key fk_simulado_questions_concurso já existe';
    END IF;
END $$;

-- 4. Adicionar Foreign Key para flashcards.concurso_id (se não existir)
DO $$
BEGIN
    IF NOT constraint_exists('fk_flashcards_concurso', 'flashcards') THEN
        ALTER TABLE public.flashcards 
        ADD CONSTRAINT fk_flashcards_concurso 
        FOREIGN KEY (concurso_id) REFERENCES public.concursos(id);
        RAISE NOTICE 'Foreign key fk_flashcards_concurso criada';
    ELSE
        RAISE NOTICE 'Foreign key fk_flashcards_concurso já existe';
    END IF;
END $$;

-- 5. Adicionar Foreign Key para mapa_assuntos.concurso_id (se não existir)
DO $$
BEGIN
    IF NOT constraint_exists('fk_mapa_assuntos_concurso', 'mapa_assuntos') THEN
        ALTER TABLE public.mapa_assuntos 
        ADD CONSTRAINT fk_mapa_assuntos_concurso 
        FOREIGN KEY (concurso_id) REFERENCES public.concursos(id);
        RAISE NOTICE 'Foreign key fk_mapa_assuntos_concurso criada';
    ELSE
        RAISE NOTICE 'Foreign key fk_mapa_assuntos_concurso já existe';
    END IF;
END $$;

-- 6. Adicionar Foreign Key para questoes_semanais.concurso_id (se não existir)
DO $$
BEGIN
    IF NOT constraint_exists('fk_questoes_semanais_concurso', 'questoes_semanais') THEN
        ALTER TABLE public.questoes_semanais 
        ADD CONSTRAINT fk_questoes_semanais_concurso 
        FOREIGN KEY (concurso_id) REFERENCES public.concursos(id);
        RAISE NOTICE 'Foreign key fk_questoes_semanais_concurso criada';
    ELSE
        RAISE NOTICE 'Foreign key fk_questoes_semanais_concurso já existe';
    END IF;
END $$;

-- 7. Adicionar Foreign Key para apostila_content.concurso_id (se não existir)
DO $$
BEGIN
    IF NOT constraint_exists('fk_apostila_content_concurso', 'apostila_content') THEN
        ALTER TABLE public.apostila_content 
        ADD CONSTRAINT fk_apostila_content_concurso 
        FOREIGN KEY (concurso_id) REFERENCES public.concursos(id);
        RAISE NOTICE 'Foreign key fk_apostila_content_concurso criada';
    ELSE
        RAISE NOTICE 'Foreign key fk_apostila_content_concurso já existe';
    END IF;
END $$;

-- 8. Adicionar Foreign Key para planos_estudo.concurso_id (se não existir)
DO $$
BEGIN
    IF NOT constraint_exists('fk_planos_estudo_concurso', 'planos_estudo') THEN
        ALTER TABLE public.planos_estudo 
        ADD CONSTRAINT fk_planos_estudo_concurso 
        FOREIGN KEY (concurso_id) REFERENCES public.concursos(id);
        RAISE NOTICE 'Foreign key fk_planos_estudo_concurso criada';
    ELSE
        RAISE NOTICE 'Foreign key fk_planos_estudo_concurso já existe';
    END IF;
END $$;

-- Limpar a função auxiliar
DROP FUNCTION IF EXISTS constraint_exists(text, text);

-- Verificar se as foreign keys foram criadas corretamente
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('apostilas', 'simulados', 'simulado_questions', 'flashcards', 'mapa_assuntos', 'questoes_semanais', 'apostila_content', 'planos_estudo')
ORDER BY tc.table_name, kcu.column_name; 