import Link from 'next/link'
import Header from '../components/Header'
import { situationsGraves } from '../../lib/mocks/situations-graves'

const getUrgenceColor = (niveau: string) => {
  switch (niveau) {
    case 'critique':
      return 'bg-red-100 text-red-700 border-red-300'
    case 'urgent':
      return 'bg-orange-100 text-orange-700 border-orange-300'
    case 'grave':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

export default function SituationsGraves() {
  // Grouper par catégorie
  const situationsParCategorie = situationsGraves.reduce((acc, situation) => {
    if (!acc[situation.categorie]) {
      acc[situation.categorie] = []
    }
    acc[situation.categorie].push(situation)
    return acc
  }, {} as Record<string, typeof situationsGraves>)

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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-[#a50000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Situations Graves
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Urgences et situations critiques en hématologie. Protocoles d'urgence, conduites à tenir et prise en charge immédiate.
          </p>
        </section>

        {/* Liste des situations par catégorie */}
        <section className="max-w-6xl mx-auto space-y-12">
          {Object.entries(situationsParCategorie).map(([categorie, situations]) => (
            <div key={categorie}>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-200">
                {categorie}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {situations.map((situation) => (
                  <Link
                    key={situation.id}
                    href={`/situations-graves/${situation.id}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-red-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#a50000] transition-colors duration-300 flex-1">
                          {situation.nom}
                        </h3>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-[#a50000] transition-colors duration-300 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgenceColor(situation.niveauUrgence)}`}>
                          {situation.niveauUrgence.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {situation.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Contexte: </span>
                        <span className="line-clamp-2">{situation.contexte}</span>
                      </div>
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