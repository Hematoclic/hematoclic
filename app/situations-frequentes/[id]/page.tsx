import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import { getSituationFrequenteById } from '@/lib/db'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const situation = await getSituationFrequenteById(id)
  if (!situation) {
    return { title: 'Situation introuvable | Hématoclic' }
  }
  return {
    title: `${situation.nom} | Hématoclic`,
    description: situation.description?.slice(0, 160) || `Situation fréquente : ${situation.nom}`,
  }
}

export default async function SituationFrequenteDetail({ params }: PageProps) {
  const { id } = await params
  const situation = await getSituationFrequenteById(id)

  if (!situation) {
    notFound()
  }

  const { signesCliniques, examensComplementaires, conduiteATenir } = situation

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Back button */}
        <Link
          href="/situations-frequentes"
          className="inline-flex items-center text-gray-600 hover:text-[#a50000] transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux situations fréquentes
        </Link>

        {/* Header */}
        <section className="mb-8">
          <div className="inline-block px-4 py-2 bg-[#a50000]/10 text-[#a50000] text-sm font-medium rounded-full mb-4">
            {situation.categorie}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {situation.nom}
          </h1>
          {situation.description && (
            <p className="text-lg text-gray-600 max-w-3xl">{situation.description}</p>
          )}
        </section>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Contexte */}
          {situation.contexte && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contexte</h2>
              <p className="text-gray-700 leading-relaxed">{situation.contexte}</p>
            </section>
          )}

          {/* Signes cliniques */}
          {(signesCliniques.symptomes.length > 0 || signesCliniques.signes.length > 0) && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Signes cliniques</h2>
              <div className="space-y-6">
                {signesCliniques.symptomes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Symptômes</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {signesCliniques.symptomes.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {signesCliniques.signes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Signes</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {signesCliniques.signes.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Examens complémentaires */}
          {(examensComplementaires.examensRecommandes.length > 0 || examensComplementaires.valeursCles.length > 0) && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Examens complémentaires</h2>
              <div className="space-y-6">
                {examensComplementaires.examensRecommandes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Examens recommandés</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {examensComplementaires.examensRecommandes.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {examensComplementaires.valeursCles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Valeurs clés</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {examensComplementaires.valeursCles.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Prise en charge */}
          {(conduiteATenir.mesures.length > 0 ||
            conduiteATenir.traitement.length > 0 ||
            conduiteATenir.surveillance.length > 0 ||
            conduiteATenir.precautions.length > 0) && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Prise en charge</h2>
              <div className="space-y-6">
                {conduiteATenir.mesures.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Mesures</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {conduiteATenir.mesures.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {conduiteATenir.traitement.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Traitement</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {conduiteATenir.traitement.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {conduiteATenir.surveillance.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Surveillance</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {conduiteATenir.surveillance.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {conduiteATenir.precautions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Précautions</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {conduiteATenir.precautions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Complications */}
          {situation.complications && situation.complications.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Complications</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {situation.complications.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Pronostic */}
          {situation.pronostic && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pronostic</h2>
              <p className="text-gray-700 leading-relaxed">{situation.pronostic}</p>
            </section>
          )}

          {/* Références */}
          {situation.references && situation.references.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Références</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {situation.references.map((reference, index) => (
                  <li key={index} className="text-sm">{reference}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Mise à jour */}
          {situation.miseAJour && (
            <div className="text-center text-sm text-gray-500">
              Dernière mise à jour: {new Date(situation.miseAJour).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
