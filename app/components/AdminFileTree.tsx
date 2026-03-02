'use client'
import { useState } from 'react'
import Link from 'next/link'

interface FileItem {
  id: string
  name: string
  description?: string
  badge?: {
    text: string
    color: string
  }
  href: string
  editHref?: string
  onDelete?: () => void
}

interface FolderData {
  name: string
  files?: FileItem[]
  subfolders?: FolderData[]
}

interface AdminFileTreeProps {
  folders: FolderData[]
  fileIcon?: React.ReactNode
  accentColor?: string
  onCreateFolder?: (path: string[]) => void
  onCreateFile?: (path: string[]) => void
  createFileLabel?: string
  createFolderLabel?: string
  isDeleting?: string | null
}

// Compter récursivement les fichiers dans un dossier
const countFiles = (folder: FolderData): number => {
  let count = folder.files?.length || 0
  if (folder.subfolders) {
    count += folder.subfolders.reduce((acc, sub) => acc + countFiles(sub), 0)
  }
  return count
}

// Compter le total de fichiers dans tous les dossiers
const countAllFiles = (folders: FolderData[]): number => {
  return folders.reduce((acc, folder) => acc + countFiles(folder), 0)
}

// Compter récursivement tous les dossiers
const countAllFolders = (folders: FolderData[]): number => {
  return folders.reduce((acc, folder) => {
    let count = 1
    if (folder.subfolders) {
      count += countAllFolders(folder.subfolders)
    }
    return acc + count
  }, 0)
}

export default function AdminFileTree({ 
  folders, 
  fileIcon, 
  accentColor = '#a50000',
  onCreateFolder,
  onCreateFile,
  createFileLabel = 'Nouvelle fiche',
  createFolderLabel = 'Nouveau dossier',
  isDeleting
}: AdminFileTreeProps) {
  const [path, setPath] = useState<string[]>([])

  const getCurrentFolder = (): FolderData | null => {
    if (path.length === 0) return null
    
    let current: FolderData | undefined = folders.find(f => f.name === path[0])
    for (let i = 1; i < path.length && current; i++) {
      current = current.subfolders?.find(f => f.name === path[i])
    }
    return current || null
  }

  const getCurrentItems = (): { folders: FolderData[], files: FileItem[] } => {
    if (path.length === 0) {
      return { folders, files: [] }
    }
    const current = getCurrentFolder()
    return {
      folders: current?.subfolders || [],
      files: current?.files || []
    }
  }

  const navigateTo = (folderName: string) => {
    setPath([...path, folderName])
  }

  const navigateBack = () => {
    setPath(path.slice(0, -1))
  }

  const navigateToIndex = (index: number) => {
    setPath(path.slice(0, index + 1))
  }

  const { folders: currentFolders, files: currentFiles } = getCurrentItems()
  const totalFiles = countAllFiles(folders)
  const totalFolders = countAllFolders(folders)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Barre de navigation / breadcrumb */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setPath([])}
          className={`flex items-center gap-2 text-sm transition-colors flex-shrink-0 ${
            path.length > 0 ? 'text-gray-500 hover:text-gray-700' : 'text-gray-900 font-medium'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Racine</span>
        </button>
        
        {path.map((folder, index) => (
          <div key={index} className="flex items-center gap-2 flex-shrink-0">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <button
              onClick={() => navigateToIndex(index)}
              className={`text-sm transition-colors ${
                index === path.length - 1 
                  ? 'text-gray-900 font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {folder}
            </button>
          </div>
        ))}

        <div className="ml-auto text-xs text-gray-500 flex-shrink-0">
          {path.length === 0
            ? `${totalFolders} dossier(s) • ${totalFiles} fiche(s)`
            : `${currentFolders.length} dossier(s) • ${currentFiles.length} fiche(s)`
          }
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        {/* Bouton retour */}
        {path.length > 0 && (
          <button
            onClick={navigateBack}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Retour</span>
          </button>
        )}

        <div className="flex-1" />

        {/* Bouton nouveau dossier */}
        {onCreateFolder && (
          <button
            onClick={() => onCreateFolder(path)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span>{createFolderLabel}</span>
          </button>
        )}

        {/* Bouton nouvelle fiche - seulement si on est dans un dossier */}
        {onCreateFile && path.length > 0 && (
          <button
            onClick={() => onCreateFile(path)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-white rounded-lg transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>{createFileLabel}</span>
          </button>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Message si à la racine */}
        {path.length === 0 && folders.length > 0 && (
          <p className="text-sm text-gray-500 mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            💡 Sélectionnez un dossier pour voir et ajouter des fiches
          </p>
        )}

        {/* Grille de dossiers et fichiers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {/* Dossiers */}
          {currentFolders.map((folder) => (
            <button
              key={folder.name}
              onClick={() => navigateTo(folder.name)}
              className="group flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <div className="relative mb-3">
                <svg 
                  className="w-16 h-16 transition-transform duration-200 group-hover:scale-110" 
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <ellipse cx="12" cy="20" rx="8" ry="1.5" fill="#e5e7eb" />
                  <path 
                    d="M2 6a2 2 0 012-2h5l2 2h9a2 2 0 012 2v2H2V6z" 
                    fill={accentColor}
                    opacity="0.7"
                  />
                  <path 
                    d="M2 8h20v9a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" 
                    fill={accentColor}
                  />
                  <path 
                    d="M2 8h20v2H2V8z" 
                    fill="white"
                    opacity="0.2"
                  />
                </svg>
                <span 
                  className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center text-xs font-bold text-white rounded-full"
                  style={{ backgroundColor: accentColor }}
                >
                  {countFiles(folder)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 text-center line-clamp-2 group-hover:text-gray-900">
                {folder.name}
              </span>
              {folder.subfolders && folder.subfolders.length > 0 && (
                <span className="text-xs text-gray-400 mt-1">
                  {folder.subfolders.length} sous-dossier(s)
                </span>
              )}
            </button>
          ))}

          {/* Fichiers */}
          {currentFiles.map((file) => (
            <div
              key={file.id}
              className="group relative flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              {/* Menu actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1 bg-white rounded-lg shadow-md border border-gray-200 p-1">
                  {file.editHref && (
                    <Link
                      href={file.editHref}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Modifier"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                  )}
                  {file.onDelete && (
                    <button
                      onClick={file.onDelete}
                      disabled={isDeleting === file.id}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      title="Supprimer"
                    >
                      {isDeleting === file.id ? (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <Link href={file.href} className="flex flex-col items-center">
                <div className="relative mb-3">
                  {fileIcon ? (
                    <div className="w-14 h-14 flex items-center justify-center">
                      {fileIcon}
                    </div>
                  ) : (
                    <svg 
                      className="w-14 h-14 transition-transform duration-200 group-hover:scale-110" 
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <ellipse cx="12" cy="21" rx="6" ry="1" fill="#e5e7eb" />
                      <path 
                        d="M6 2h8l6 6v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" 
                        fill="white"
                        stroke={accentColor}
                        strokeWidth="1.5"
                      />
                      <path 
                        d="M14 2v6h6" 
                        fill="#f3f4f6"
                        stroke={accentColor}
                        strokeWidth="1.5"
                      />
                      <path d="M8 12h8M8 15h6" stroke={accentColor} strokeWidth="1" opacity="0.5" />
                    </svg>
                  )}
                  {file.badge && (
                    <span 
                      className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded ${file.badge.color}`}
                    >
                      {file.badge.text}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 text-center line-clamp-2 group-hover:text-gray-900">
                  {file.name}
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* Message si vide */}
        {currentFolders.length === 0 && currentFiles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="mb-4">Ce dossier est vide</p>
            {onCreateFile && path.length > 0 && (
              <button
                onClick={() => onCreateFile(path)}
                className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: accentColor }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>{createFileLabel}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
