import { Metadata } from 'next';
import FlashcardsClient from './flashcards-client';
import { createServerSupabaseClient } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Flashcards',
};

export default async function FlashcardsPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('cartoes-memorizacao')
    .select('*');
    
  const cartoesMemorizacao = data || [];
  
  return <FlashcardsClient cartoesMemorizacao={cartoesMemorizacao} />;
}
