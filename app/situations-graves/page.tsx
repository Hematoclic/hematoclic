import Link from 'next/link'
import Header from '../components/Header'

export default function SituationsGraves() {
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

        {/* Content area */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <p className="text-center text-gray-500">
              Contenu à venir
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}