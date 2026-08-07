'use client'
import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extensions'
import RichTextToolbar from './RichTextToolbar'

/**
 * Éditeur de texte riche (WYSIWYG) basé sur Tiptap v3.
 *
 * Quoi : Client Component contrôlé (value HTML / onChange HTML).
 * Pourquoi : édition des contenus éditoriaux (mentions légales, encart
 *   d'accueil) en admin, mutualisé.
 * Comment : StarterKit (gras/italique/souligné/titres/listes/liens) +
 *   Placeholder. immediatelyRender:false (obligatoire App Router).
 *   Le HTML produit est assaini au rendu public (voir RichTextRenderer).
 */
interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  editable?: boolean
  className?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  editable = true,
  className,
}: RichTextEditorProps) {
  'use no memo'
  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
        },
      }),
      Placeholder.configure({ placeholder: placeholder ?? 'Rédigez le contenu…' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-sm max-w-none focus:outline-none min-h-40 px-4 py-3',
      },
    },
  })

  // Resynchronise seulement si la valeur externe change réellement
  // (chargement async / reset de formulaire), jamais pendant la frappe.
  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div
      className={`rounded-lg border border-gray-300 focus-within:border-[#a50000] focus-within:ring-2 focus-within:ring-[#a50000]/20 transition-colors ${className ?? ''}`}
    >
      {editable && <RichTextToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
