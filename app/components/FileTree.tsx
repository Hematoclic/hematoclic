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
}

interface FolderData {
  name: string
  files: FileItem[]
}

interface FileTreeProps {
  folders: FolderData[]
  fileIcon?: React.ReactNode
  accentColor?: string
}

// Icône dossier
const FolderIcon = ({ isOpen, color = '#a50000' }: { isOpen: boolean; color?: string }) => (
  <svg 
    className="w-5 h-5 flex-shrink-0 transition-colors duration-200" 
    fill={isOpen ? color : 'none'} 
    stroke={color} 
    viewBox="0 0 24 24"
  >
    {isOpen ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    )}
  </svg>
)

// Icône fichier par défaut
const DefaultFileIcon = ({ color = '#a50000' }: { color?: string }) => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke={color} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

// Icône chevron
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg 
    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export default function FileTree({ folders, fileIcon, accentColor = '#a50000' }: FileTreeProps) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(
    // Ouvrir tous les dossiers par défaut
    folders.reduce((acc, folder) => ({ ...acc, [folder.name]: true }), {})
  )

  const toggleFolder = (folderName: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }))
  }

  const expandAll = () => {
    setOpenFolders(folders.reduce((acc, folder) => ({ ...acc, [folder.name]: true }), {}))
  }

  const collapseAll = () => {
    setOpenFolders(folders.reduce((acc, folder) => ({ ...acc, [folder.name]: false }), {}))
  }

  const totalFiles = folders.reduce((acc, folder) => acc + folder.files.length, 0)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Barre d'outils */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span>{folders.length} dossier{folders.length > 1 ? 's' : ''}</span>
          <span className="text-gray-300">•</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{totalFiles} fiche{totalFiles > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={expandAll}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Tout déplier"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
          <button
            onClick={collapseAll}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Tout replier"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          </button>
        </div>
      </div>

      {/* Arborescence */}
      <div className="divide-y divide-gray-100">
        {folders.map((folder) => (
          <div key={folder.name}>
            {/* En-tête du dossier */}
            <button
              onClick={() => toggleFolder(folder.name)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
            >
              <ChevronIcon isOpen={openFolders[folder.name]} />
              <FolderIcon isOpen={openFolders[folder.name]} color={accentColor} />
              <span className="font-semibold text-gray-900 group-hover:text-gray-700 flex-1">
                {folder.name}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {folder.files.length}
              </span>
            </button>

            {/* Contenu du dossier */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openFolders[folder.name] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pl-4 pr-2 pb-2">
                {folder.files.map((file, index) => (
                  <Link
                    key={file.id}
                    href={file.href}
                    className="flex items-center gap-3 px-4 py-2.5 ml-6 rounded-lg hover:bg-gray-50 transition-all duration-200 group border-l-2 border-transparent hover:border-l-2 hover:border-gray-200"
                    style={{ 
                      animationDelay: `${index * 30}ms`,
                    }}
                  >
                    {/* Ligne de connexion */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />
                    
                    {fileIcon || <DefaultFileIcon color={accentColor} />}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 group-hover:text-gray-900 truncate">
                          {file.name}
                        </span>
                        {file.badge && (
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${file.badge.color}`}>
                            {file.badge.text}
                          </span>
                        )}
                      </div>
                      {file.description && (
                        <p className="text-sm text-gray-500 truncate mt-0.5">
                          {file.description}
                        </p>
                      )}
                    </div>

                    <svg 
                      className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {totalFiles === 0 && (
        <div className="px-4 py-8 text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p>Aucune fiche disponible</p>
        </div>
      )}
    </div>
  )
}
