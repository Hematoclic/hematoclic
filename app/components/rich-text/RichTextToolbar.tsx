'use client'
import React from 'react'
import { type Editor, useEditorState } from '@tiptap/react'

/**
 * Barre d'outils de l'éditeur riche (gras, italique, souligné, titres,
 * listes, lien). Lit l'état actif via useEditorState (perf + compat
 * React Compiler). Accent aligné sur la couleur #a50000 du projet.
 */
function Btn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`h-8 min-w-8 px-2 rounded text-sm font-medium transition-colors disabled:opacity-40 ${
        active ? 'bg-[#a50000] text-white' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

export default function RichTextToolbar({ editor }: { editor: Editor }) {
  'use no memo'
  const s = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      h2: editor.isActive('heading', { level: 2 }),
      h3: editor.isActive('heading', { level: 3 }),
      bullet: editor.isActive('bulletList'),
      ordered: editor.isActive('orderedList'),
      link: editor.isActive('link'),
    }),
  })

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL du lien', prev ?? '')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
      <Btn title="Gras" active={s.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <b>B</b>
      </Btn>
      <Btn title="Italique" active={s.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <i>I</i>
      </Btn>
      <Btn title="Souligné" active={s.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <u>U</u>
      </Btn>
      <span className="mx-1 h-5 w-px bg-gray-200" />
      <Btn title="Titre 2" active={s.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </Btn>
      <Btn title="Titre 3" active={s.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </Btn>
      <span className="mx-1 h-5 w-px bg-gray-200" />
      <Btn title="Liste à puces" active={s.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        •
      </Btn>
      <Btn title="Liste numérotée" active={s.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1.
      </Btn>
      <span className="mx-1 h-5 w-px bg-gray-200" />
      <Btn title="Lien" active={s.link} onClick={setLink}>
        🔗
      </Btn>
    </div>
  )
}
