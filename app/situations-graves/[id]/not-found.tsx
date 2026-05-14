import Link from 'next/link'
import Header from '../../components/Header'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Situation non trouvée
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            La situation grave que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Link
            href="/situations-graves"
            className="inline-flex items-center px-6 py-3 bg-[#a50000] text-white rounded-lg hover:bg-[#a50000]/90 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux situations
          </Link>
        </div>
      </div>
    </main>
  )
}

