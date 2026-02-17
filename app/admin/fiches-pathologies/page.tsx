'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FichePathologique } from '@/lib/types/fiche-pathologique'
import { getFichesPathologiques, deleteFichePathologique } from '@/lib/db'
import AdminFileTree from '@/app/components/AdminFileTree'

export default function AdminFichesPathologies() {
  const router = useRouter()
  const [fiches, setFiches] = useState<FichePathologique[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [newFolderPath, setNewFolderPath] = useState<string[]>([])
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    loadFiches()
  }, [])

  const loadFiches = async () => {
    setLoading(true)
    const data = await getFichesPathologiques()
    setFiches(data)
    setLoading(false)
  }

  // Transformer les fiches en structure de dossiers
  const buildFolderStructure = () => {
    const categories = [...new Set(fiches.map(f => f.categorie))]
    
    return categories.map(categorie => ({
      name: categorie,
      files: fiches
        .filter(f => f.categorie === categorie)
        .map(fiche => ({
          id: fiche.id,
          name: fiche.informationsGenerales.nom,
          description: fiche.informationsGenerales.definition,
          href: `/fiches-pathologies/${fiche.id}`,
          editHref: `/admin/fiches-pathologies/${fiche.id}/edit`,
          onDelete: () => handleDelete(fiche.id, fiche.informationsGenerales.nom)
        }))
    }))
  }

  const handleDelete = async (id: string, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${nom}" ?`)) {
      return
    }

    setDeleting(id)
    const result = await deleteFichePathologique(id)
    
    if (result.success) {
      setFiches(fiches.filter(f => f.id !== id))
    } else {
      alert(`Erreur: ${result.error}`)
    }
    setDeleting(null)
  }

  const handleCreateFolder = (path: string[]) => {
    setNewFolderPath(path)
    setNewFolderName('')
    setShowNewFolderModal(true)
  }

  const handleCreateFile = (path: string[]) => {
    // Le premier élément du path est la catégorie
    const categorie = path[0] || ''
    router.push(`/admin/fiches-pathologies/new?categorie=${encodeURIComponent(categorie)}`)
  }

  const handleSubmitNewFolder = () => {
    if (!newFolderName.trim()) {
      alert('Veuillez entrer un nom de dossier')
      return
    }
    // Pour l'instant, on crée juste une fiche placeholder pour créer la catégorie
    // Dans une vraie app, on aurait une table categories
    alert(`Note: Pour créer le dossier "${newFolderName}", créez une fiche dans cette catégorie.`)
    setShowNewFolderModal(false)
    router.push(`/admin/fiches-pathologies/new?categorie=${encodeURIComponent(newFolderName)}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 mx-auto text-[#a50000] mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500">Chargement des fiches...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fiches Pathologies</h1>
          <p className="text-gray-600 mt-1">Gérez les fiches pathologiques</p>
        </div>
        <button
          onClick={loadFiches}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Actualiser</span>
        </button>
      </div>

      {/* File Tree */}
      <AdminFileTree
        folders={buildFolderStructure()}
        accentColor="#a50000"
        onCreateFolder={handleCreateFolder}
        onCreateFile={handleCreateFile}
        createFileLabel="Nouvelle fiche"
        createFolderLabel="Nouvelle catégorie"
        isDeleting={deleting}
      />

      {/* Modal nouveau dossier */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle catégorie</h3>
            <p className="text-sm text-gray-500 mb-4">
              {newFolderPath.length > 0 
                ? `Créer dans: ${newFolderPath.join(' / ')}`
                : 'Créer à la racine'
              }
            </p>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom de la catégorie..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitNewFolder}
                className="px-4 py-2 bg-[#a50000] text-white rounded-lg hover:bg-[#8a0000] transition-colors"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
