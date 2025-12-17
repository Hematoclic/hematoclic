import Link from 'next/link'
import Header from '../components/Header'
import { getFichesPathologiques } from '@/lib/db'

export default async function FichesPathologies() {
  const fichesPathologiques = await getFichesPathologiques()
  
  // Grouper par catégorie
  const fichesParCategorie = fichesPathologiques.reduce((acc, fiche) => {
    if (!acc[fiche.categorie]) {
      acc[fiche.categorie] = []
    }
    acc[fiche.categorie].push(fiche)
    return acc
  }, {} as Record<string, typeof fichesPathologiques>)

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
          Retour à l'accueil
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

        {/* Liste des fiches par catégorie */}
        <section className="max-w-6xl mx-auto space-y-12">
          {Object.entries(fichesParCategorie).map(([categorie, fiches]) => (
            <div key={categorie}>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-[#a50000]/20">
                {categorie}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fiches.map((fiche) => (
                  <Link
                    key={fiche.id}
                    href={`/fiches-pathologies/${fiche.id}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-[#a50000]/30 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#a50000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#a50000] transition-colors duration-300 flex-1">
                          {fiche.nom}
                        </h3>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-[#a50000] transition-colors duration-300 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {fiche.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-[#a50000]/10 text-[#a50000] text-xs font-medium rounded-full">
                          Clinique
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Biologique
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Thérapeutique
                        </span>
                      </div>
                      {fiche.miseAJour && (
                        <p className="text-xs text-gray-500">
                          Mise à jour: {new Date(fiche.miseAJour).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}