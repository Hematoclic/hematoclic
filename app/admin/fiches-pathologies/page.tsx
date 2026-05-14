'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FichePathologique } from '@/lib/types/fiche-pathologique'
import {
  getFichesPathologiques,
  deleteFichePathologique,
  getCategories,
  createCategory,
  deleteCategory,
  findCategoryByPath,
  Category,
} from '@/lib/db'
import { buildFolderTree } from '@/lib/folder-tree'
import AdminFileTree from '@/app/components/AdminFileTree'
import NewFolderModal from '@/app/components/NewFolderModal'

export default function AdminFichesPathologies() {
  const router = useRouter()
  const [fiches, setFiches] = useState<FichePathologique[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [newFolderPath, setNewFolderPath] = useState<string[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [fichesData, categoriesData] = await Promise.all([
      getFichesPathologiques(),
      getCategories('fiches'),
    ])
    setFiches(fichesData)
    setCategories(categoriesData)
    setLoading(false)
  }

  const handleDelete = async (id: string, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${nom}" ?`)) return

    setDeleting(id)
    const result = await deleteFichePathologique(id)
    if (result.success) {
      setFiches(fiches.filter((f) => f.id !== id))
    } else {
      alert(`Erreur: ${result.error}`)
    }
    setDeleting(null)
  }

  const handleDeleteFolder = async (id: string, nom: string) => {
    const fichesInCategory = fiches.filter((f) => f.categorie === nom)
    if (fichesInCategory.length > 0) {
      alert(
        `Impossible de supprimer le dossier "${nom}" car il contient ${fichesInCategory.length} fiche(s). Supprimez d'abord les fiches.`,
      )
      return
    }
    const hasChildren = categories.some((c) => c.parentId === id)
    if (hasChildren) {
      alert(`Impossible de supprimer le dossier "${nom}" car il contient des sous-dossiers.`)
      return
    }
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le dossier "${nom}" ?`)) return

    const result = await deleteCategory(id)
    if (result.success) {
      setCategories(categories.filter((c) => c.id !== id))
    } else {
      alert(`Erreur: ${result.error}`)
    }
  }

  const folders = buildFolderTree({
    categories,
    items: fiches,
    toFileItem: (fiche) => ({
      id: fiche.id,
      name: fiche.informationsGenerales.nom,
      description: fiche.informationsGenerales.definition,
      href: `/fiches-pathologies/${fiche.id}`,
      editHref: `/admin/fiches-pathologies/${fiche.id}/edit`,
      onDelete: () => handleDelete(fiche.id, fiche.informationsGenerales.nom),
    }),
    onDeleteFolder: handleDeleteFolder,
  })

  const handleCreateFolder = (path: string[]) => {
    setNewFolderPath(path)
    setShowNewFolderModal(true)
  }

  const handleCreateFile = (path: string[]) => {
    const categorie = path[path.length - 1] || ''
    router.push(`/admin/fiches-pathologies/new?categorie=${encodeURIComponent(categorie)}`)
  }

  const handleSubmitNewFolder = async (name: string) => {
    let parentId: string | null = null
    if (newFolderPath.length > 0) {
      const parent = findCategoryByPath(categories, newFolderPath)
      if (!parent) {
        alert('Dossier parent introuvable. Rafraîchissez la page.')
        return
      }
      parentId = parent.id
    }
    const result = await createCategory(name, 'fiches', parentId)
    if (result.success && result.category) {
      setCategories([...categories, result.category])
      setShowNewFolderModal(false)
    } else {
      alert(`Erreur: ${result.error}`)
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fiches Pathologies</h1>
          <p className="text-gray-600 mt-1">Gérez les fiches pathologiques</p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Actualiser</span>
        </button>
      </div>

      <AdminFileTree
        folders={folders}
        accentColor="#a50000"
        onCreateFolder={handleCreateFolder}
        onCreateFile={handleCreateFile}
        createFileLabel="Nouvelle fiche"
        createFolderLabel="Nouvelle catégorie"
        isDeleting={deleting}
      />

      <NewFolderModal
        open={showNewFolderModal}
        path={newFolderPath}
        accentColor="#a50000"
        onCancel={() => setShowNewFolderModal(false)}
        onSubmit={handleSubmitNewFolder}
      />
    </div>
  )
}
