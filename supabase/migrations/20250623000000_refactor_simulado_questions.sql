ALTER TABLE public.simulado_questions
DROP COLUMN IF EXISTS discipline;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='simulado_questions'
      AND column_name='disciplina'
  ) THEN
    EXECUTE 'ALTER TABLE public.simulado_questions RENAME COLUMN disciplina TO subject;';
  END IF;
END $$;