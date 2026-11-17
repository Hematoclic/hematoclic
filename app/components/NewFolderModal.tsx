'use client'
import { useState } from 'react'

interface NewFolderModalProps {
  open: boolean
  path: string[]
  accentColor?: string
  onCancel: () => void
  onSubmit: (name: string) => Promise<void>
}

export default function NewFolderModal({
  open,
  path,
  accentColor = '#a50000',
  onCancel,
  onSubmit,
}: NewFolderModalProps) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      alert('Veuillez entrer un nom de dossier')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit(trimmed)
      setName('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle catégorie</h3>
        <p className="text-sm text-gray-500 mb-4">
          {path.length > 0 ? `Créer dans : ${path.join(' / ')}` : 'Créer à la racine'}
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la catégorie..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 transition-colors mb-4 outline-none"
          style={{
            // @ts-expect-error CSS custom prop typing
            '--tw-ring-color': `${accentColor}33`,
            borderColor: undefined,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = accentColor
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = ''
          }}
          autoFocus
          maxLength={120}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit()
            if (e.key === 'Escape') onCancel()
          }}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: accentColor }}
          >
            {submitting && (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Créer
          </button>
        </div>
      </div>
    </div>
  )
}
