'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface SearchResult {
  id: string
  type: 'fiche' | 'situation'
  nom: string
  categorie: string
  description: string
  badge?: {
    text: string
    color: string
  }
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus sur l'input à l'ouverture
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Fermer avec Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Recherche avec debounce
  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Erreur de recherche:', error)
      setResults([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, search])

  const getUrgenceBadgeColor = (niveau: string) => {
    switch (niveau) {
      case 'CRITIQUE': return 'bg-red-100 text-red-700'
      case 'URGENT': return 'bg-orange-100 text-orange-700'
      case 'GRAVE': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center pt-[10vh] px-4 pb-10">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Barre de recherche */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une pathologie, situation..."
              className="flex-1 text-lg outline-none placeholder-gray-400"
            />
            {loading && (
              <svg className="animate-spin w-5 h-5 text-[#a50000]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Résultats */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.length < 2 ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p>Tapez au moins 2 caractères pour rechercher</p>
              </div>
            ) : results.length === 0 && !loading ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Aucun résultat pour &quot;{query}&quot;</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.type === 'fiche' ? `/fiches-pathologies/${result.id}` : `/situations-graves/${result.id}`}
                    onClick={onClose}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Icône */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      result.type === 'fiche' ? 'bg-[#a50000]/10' : 'bg-red-100'
                    }`}>
                      {result.type === 'fiche' ? (
                        <svg className="w-5 h-5 text-[#a50000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{result.nom}</h3>
                        {result.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getUrgenceBadgeColor(result.badge.text)}`}>
                            {result.badge.text}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{result.categorie}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{result.description}</p>
                    </div>

                    {/* Flèche */}
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-600">↵</kbd>
                pour ouvrir
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-600">Esc</kbd>
                pour fermer
              </span>
            </div>
            {results.length > 0 && (
              <span>{results.length} résultat{results.length > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
