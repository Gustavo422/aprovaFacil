import { notFound } from 'next/navigation';
import { logger } from '@/lib/logger';
import { createServerSupabaseClient } from '@/lib/supabase';

// --- START: Type definitions for TipTap/EditorJS-like content ---
interface TextNode {
  type: 'text';
  text: string;
}

interface ParagraphNode {
  type: 'paragraph';
  content?: TextNode[];
}

interface HeadingNode {
  type: 'heading';
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
  content?: TextNode[];
}

type ContentNode = ParagraphNode | HeadingNode;

interface DocNode {
  type: 'doc';
  content: ContentNode[];
}
// --- END: Type definitions ---

interface ApostilaContent {
  id: string;
  module_number: number;
  title: string;
  content_json: DocNode | string;
}

interface Apostila {
  id: string;
  slug: string;
  title: string;
  description: string;
  concurso_id: string | null;
  created_at: string;
  apostila_content: ApostilaContent[];
}

async function getApostilaBySlug(slug: string): Promise<Apostila | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: apostila, error } = await supabase
      .from('apostilas')
      .select('*, apostila_content(*)')
      .eq('slug', slug)
      .single();

    if (error) {
      logger.error(`Erro ao buscar apostila slug ${slug}: ${error.message}`);
      return null;
    }
    return apostila;
  } catch (error) {
    logger.error(`Failed to fetch apostila with slug ${slug}`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

function renderContent(content: DocNode | string): string {
  if (typeof content === 'string') {
    return content;
  }
  if (typeof content === 'object' && content !== null && content.type === 'doc' && Array.isArray(content.content)) {
    return content.content.map((node: ContentNode) => {
      const nodeContent = node.content?.map((textNode: TextNode) => textNode.text).join('') || '';
      if (node.type === 'paragraph') {
        return `<p>${nodeContent}</p>`;
      }
      if (node.type === 'heading') {
        const level = node.attrs?.level || 1;
        return `<h${level}>${nodeContent}</h${level}>`;
      }
      return '';
    }).join('');
  }
  return '';
}

export interface PageProps {
  params: { slug: string }
}

export default async function ApostilaPage({ params }: PageProps) {
  const { slug } = await params;
  const apostila = await getApostilaBySlug(slug);

  if (!apostila) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{apostila.title}</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">{apostila.description}</p>
        </header>

        <div className="space-y-8">
          {apostila.apostila_content && apostila.apostila_content
            .sort((a, b) => a.module_number - b.module_number)
            .map(module => (
              <section key={module.id}>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{module.title}</h2>
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderContent(module.content_json) }}
                />
              </section>
            ))}
        </div>
      </article>
    </div>
  );
}