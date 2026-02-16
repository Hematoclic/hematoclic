import Link from 'next/link'
import Header from '../components/Header'
import FileTree from '../components/FileTree'
import { getSituationsGraves } from '@/lib/db'

const getUrgenceBadgeColor = (niveau: string) => {
  switch (niveau) {
    case 'critique':
      return 'bg-red-100 text-red-700'
    case 'urgent':
      return 'bg-orange-100 text-orange-700'
    case 'grave':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default async function SituationsGraves() {
  const situationsGraves = await getSituationsGraves()
  
  // Grouper par catégorie et transformer pour le FileTree
  const situationsParCategorie = situationsGraves.reduce((acc, situation) => {
    if (!acc[situation.categorie]) {
      acc[situation.categorie] = []
    }
    acc[situation.categorie].push(situation)
    return acc
  }, {} as Record<string, typeof situationsGraves>)

  // Transformer en format FileTree
  const folders = Object.entries(situationsParCategorie).map(([categorie, situations]) => ({
    name: categorie,
    files: situations.map(situation => ({
      id: situation.id,
      name: situation.nom,
      description: situation.description,
      badge: {
        text: situation.niveauUrgence.toUpperCase(),
        color: getUrgenceBadgeColor(situation.niveauUrgence),
      },
      href: `/situations-graves/${situation.id}`,
    }))
  }))

  // Icône d'alerte pour les situations graves
  const alertIcon = (
    <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )

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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-[#a50000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Situations Graves
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Urgences et situations critiques en hématologie. Protocoles d&apos;urgence, conduites à tenir et prise en charge immédiate.
          </p>
        </section>

        {/* File Tree */}
        <section className="max-w-4xl mx-auto">
          <FileTree 
            folders={folders} 
            fileIcon={alertIcon}
            accentColor="#dc2626"
          />
        </section>
      </div>
    </main>
  )
}