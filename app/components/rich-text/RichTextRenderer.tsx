import { sanitizeRichText } from '@/lib/sanitize'

/**
 * Rendu public d'un contenu riche stocké en HTML.
 *
 * Quoi : Server Component qui injecte du HTML assaini dans un conteneur
 *   `.prose` (Tailwind Typography).
 * Pourquoi : afficher les contenus éditoriaux (mentions légales, encart)
 *   SANS embarquer Tiptap côté client — contenu SSR, indexable.
 * Comment : ré-assainit systématiquement au rendu (défense en profondeur).
 *   N'importe AUCUN module @tiptap/* (0 JS d'éditeur dans le bundle).
 */
interface RichTextRendererProps {
  content: string
  className?: string
}

export default function RichTextRenderer({ content, className }: RichTextRendererProps) {
  const clean = sanitizeRichText(content)
  return (
    <div
      className={`prose prose-sm md:prose-base max-w-none prose-a:text-[#a50000] prose-headings:text-gray-900 ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
