'use client'
import React, { useState, useEffect } from 'react'
import {
  getLegalPageBySlug,
  getSiteSetting,
  upsertLegalPage,
  updateSiteSetting,
} from '@/lib/db'
import RichTextEditor from '@/app/components/rich-text/RichTextEditor'

/**
 * Page admin "Contenus du site".
 *
 * Quoi : édition centralisée des contenus éditoriaux (encart d'accueil
 *   + mentions légales) via l'éditeur riche Tiptap.
 * Pourquoi : regrouper les contenus pilotables (tâche 3.1 du backlog).
 * Comment : charge site_settings('home-intro') + legal_pages('mentions-legales'),
 *   édite en HTML, enregistre via le DMS (assainissement au rendu public).
 */
const LEGAL_SLUG = 'mentions-legales'
const HOME_INTRO_KEY = 'home-intro'

type SaveState = 'idle' | 'saving' | 'success' | 'error'

export default function AdminContenus() {
  const [loading, setLoading] = useState(true)

  const [homeIntro, setHomeIntro] = useState('')
  const [homeState, setHomeState] = useState<SaveState>('idle')

  const [legalTitle, setLegalTitle] = useState('Mentions légales')
  const [legalContent, setLegalContent] = useState('')
  const [legalState, setLegalState] = useState<SaveState>('idle')

  useEffect(() => {
    const load = async () => {
      const [intro, legal] = await Promise.all([
        getSiteSetting(HOME_INTRO_KEY),
        getLegalPageBySlug(LEGAL_SLUG),
      ])
      if (intro) setHomeIntro(intro.value)
      if (legal) {
        setLegalTitle(legal.title || 'Mentions légales')
        setLegalContent(legal.content)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSaveHome = async () => {
    setHomeState('saving')
    const result = await updateSiteSetting(HOME_INTRO_KEY, homeIntro)
    setHomeState(result.success ? 'success' : 'error')
    if (result.success) setTimeout(() => setHomeState('idle'), 2500)
  }

  const handleSaveLegal = async () => {
    setLegalState('saving')
    const result = await upsertLegalPage(LEGAL_SLUG, legalTitle, legalContent)
    setLegalState(result.success ? 'success' : 'error')
    if (result.success) setTimeout(() => setLegalState('idle'), 2500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 mx-auto text-[#a50000] mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500">Chargement des contenus...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contenus du site</h1>
        <p className="text-gray-600 mt-1">
          Encart d&apos;accueil et pages légales, éditables sans redéploiement.
        </p>
      </div>

      {/* Encart d'accueil */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Encart de la page d&apos;accueil</h2>
          <SaveBadge state={homeState} />
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Bloc éditorial affiché sur la page d&apos;accueil (remerciements, sources,
          avertissement…). S&apos;il est vide, le bloc n&apos;est pas affiché.
        </p>
        <RichTextEditor
          value={homeIntro}
          onChange={setHomeIntro}
          placeholder="Rédigez l'encart d'accueil…"
        />
        <div className="flex items-center justify-end gap-3 mt-4">
          {homeState === 'error' && (
            <span className="text-sm text-red-600">Échec de l&apos;enregistrement.</span>
          )}
          <button
            onClick={handleSaveHome}
            disabled={homeState === 'saving'}
            className="px-6 py-2 bg-[#a50000] text-white rounded-lg hover:bg-[#8a0000] transition-colors disabled:opacity-50"
          >
            {homeState === 'saving' ? 'Enregistrement...' : 'Enregistrer l\'encart'}
          </button>
        </div>
      </section>

      {/* Mentions légales */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Mentions légales</h2>
          <SaveBadge state={legalState} />
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Page publique <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">/mentions-legales</code>.
          Le contenu légal factuel (éditeur, directeur de publication, hébergeur, RGPD)
          doit être fourni par le client.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            type="text"
            value={legalTitle}
            onChange={(e) => setLegalTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors"
          />
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
        <RichTextEditor
          value={legalContent}
          onChange={setLegalContent}
          placeholder="Rédigez les mentions légales…"
        />
        <div className="flex items-center justify-end gap-3 mt-4">
          {legalState === 'error' && (
            <span className="text-sm text-red-600">Échec de l&apos;enregistrement.</span>
          )}
          <button
            onClick={handleSaveLegal}
            disabled={legalState === 'saving'}
            className="px-6 py-2 bg-[#a50000] text-white rounded-lg hover:bg-[#8a0000] transition-colors disabled:opacity-50"
          >
            {legalState === 'saving' ? 'Enregistrement...' : 'Enregistrer les mentions légales'}
          </button>
        </div>
      </section>
    </div>
  )
}

function SaveBadge({ state }: { state: SaveState }) {
  if (state !== 'success') return null
  return (
    <span className="inline-flex items-center gap-1 text-sm text-green-600">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Enregistré
    </span>
  )
}
