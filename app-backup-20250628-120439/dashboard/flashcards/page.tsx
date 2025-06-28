import { Metadata } from 'next';
import FlashcardsClient from './flashcards-client';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { Flashcard } from '@/src/core/database/types';

export const metadata: Metadata = {
  title: 'Flashcards',
};

export default async function FlashcardsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: flashcards = [] } = await supabase
    .from('flashcards')
    .select('*');

  return <FlashcardsClient flashcards={flashcards as Flashcard[]} />;
}
