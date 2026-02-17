import Link from 'next/link'
import Header from '../components/Header'
import FileTree from '../components/FileTree'
import { getFichesPathologiques, getCategories } from '@/lib/db'

// Désactiver le cache pour avoir les données à jour
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function FichesPathologies() {
  const [fichesPathologiques, categories] = await Promise.all([
    getFichesPathologiques(),
    getCategories('fiches')
  ])
  
  // Grouper par catégorie et transformer pour le FileTree
  const fichesParCategorie = fichesPathologiques.reduce((acc, fiche) => {
    if (!acc[fiche.categorie]) {
      acc[fiche.categorie] = []
    }
    acc[fiche.categorie].push(fiche)
    return acc
  }, {} as Record<string, typeof fichesPathologiques>)

  // Ajouter les catégories vides de la DB
  categories.forEach(cat => {
    if (!fichesParCategorie[cat.nom]) {
      fichesParCategorie[cat.nom] = []
    }
  })

  // Transformer en format FileTree
  const folders = Object.entries(fichesParCategorie).map(([categorie, fiches]) => ({
    name: categorie,
    files: fiches.map(fiche => ({
      id: fiche.id,
      name: fiche.informationsGenerales.nom,
      description: fiche.informationsGenerales.definition,
      href: `/fiches-pathologies/${fiche.id}`,
    }))
  }))

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fiches Pathologies
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Consultez les fiches détaillées des pathologies hématologiques avec leurs caractéristiques cliniques, biologiques et thérapeutiques.
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