import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../components/Header'
import FileTree from '../components/FileTree'
import { getSituationsFrequentes, getCategories } from '@/lib/db'
import { buildFolderTree } from '@/lib/folder-tree'

export const metadata: Metadata = {
  title: 'Situations Fréquentes | Hématoclic',
  description: 'Situations cliniques fréquentes en hématologie : démarche et prise en charge courante.',
}

// Désactiver le cache pour avoir les données à jour
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SituationsFrequentes() {
  const [situations, categories] = await Promise.all([
    getSituationsFrequentes(),
    getCategories('frequentes'),
  ])

  const folders = buildFolderTree({
    categories,
    items: situations,
    toFileItem: (situation) => ({
      id: situation.id,
      name: situation.nom,
      description: situation.description,
      href: `/situations-frequentes/${situation.id}`,
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Situations Fréquentes
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Cas cliniques courants en hématologie et leurs prises en charge. Situations rencontrées régulièrement en pratique clinique.
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
