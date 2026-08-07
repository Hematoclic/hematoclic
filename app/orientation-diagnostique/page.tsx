import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../components/Header'
import FileTree from '../components/FileTree'
import { getOrientationsDiagnostiques, getCategories } from '@/lib/db'
import { buildFolderTree } from '@/lib/folder-tree'

export const metadata: Metadata = {
  title: 'Orientation Diagnostique | Hématoclic',
  description: 'Aide à l\'orientation diagnostique en hématologie : démarche, examens et hypothèses.',
}

// Désactiver le cache pour avoir les données à jour
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function OrientationDiagnostique() {
  const [orientations, categories] = await Promise.all([
    getOrientationsDiagnostiques(),
    getCategories('orientations'),
  ])

  const folders = buildFolderTree({
    categories,
    items: orientations,
    toFileItem: (orientation) => ({
      id: orientation.id,
      name: orientation.nom,
      description: orientation.description,
      href: `/orientation-diagnostique/${orientation.id}`,
    }),
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-[#a50000] transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l&apos;accueil
        </Link>

        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#a50000]/10 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-[#a50000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Orientation Diagnostique
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Guide pratique pour l&apos;orientation et le diagnostic des patients en hématologie. Démarches et algorithmes à partir d&apos;un point d&apos;appel.
          </p>
        </section>

        {/* File Tree */}
        <section className="max-w-4xl mx-auto">
          <FileTree
            folders={folders}
            accentColor="#a50000"
          />
        </section>
      </div>
    </main>
  )
}
