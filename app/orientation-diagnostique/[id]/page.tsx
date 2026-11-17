import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../components/Header'
import { getOrientationDiagnostiqueById } from '@/lib/db'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const orientation = await getOrientationDiagnostiqueById(id)
  if (!orientation) {
    return { title: 'Orientation introuvable | Hématoclic' }
  }
  return {
    title: `${orientation.nom} | Hématoclic`,
    description: orientation.description?.slice(0, 160) || `Orientation diagnostique : ${orientation.nom}`,
  }
}

export default async function OrientationDiagnostiqueDetail({ params }: PageProps) {
  const { id } = await params
  const orientation = await getOrientationDiagnostiqueById(id)

  if (!orientation) {
    notFound()
  }

  const { demarche, examens, hypotheses } = orientation

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Back button */}
        <Link
          href="/orientation-diagnostique"
          className="inline-flex items-center text-gray-600 hover:text-[#a50000] transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux orientations diagnostiques
        </Link>

        {/* Header */}
        <section className="mb-8">
          <div className="inline-block px-4 py-2 bg-[#a50000]/10 text-[#a50000] text-sm font-medium rounded-full mb-4">
            {orientation.categorie}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {orientation.nom}
          </h1>
          {orientation.description && (
            <p className="text-lg text-gray-600 max-w-3xl">{orientation.description}</p>
          )}
        </section>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Signes d'appel */}
          {orientation.signesDappel.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Signes d&apos;appel</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {orientation.signesDappel.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Démarche diagnostique */}
          {(demarche.etapes.length > 0 ||
            demarche.questionsAnamnese.length > 0 ||
            demarche.signesRechercher.length > 0) && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Démarche diagnostique</h2>
              <div className="space-y-6">
                {demarche.etapes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Étapes</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      {demarche.etapes.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {demarche.questionsAnamnese.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Questions d&apos;anamnèse</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {demarche.questionsAnamnese.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {demarche.signesRechercher.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Signes à rechercher</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {demarche.signesRechercher.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Examens */}
          {(examens.premiereIntention.length > 0 || examens.secondeIntention.length > 0) && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Examens</h2>
              <div className="space-y-6">
                {examens.premiereIntention.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Première intention</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {examens.premiereIntention.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {examens.secondeIntention.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Seconde intention</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {examens.secondeIntention.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Hypothèses diagnostiques */}
          {(hypotheses.diagnosticsEvoquer.length > 0 || hypotheses.criteresOrientation.length > 0) && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Hypothèses diagnostiques</h2>
              <div className="space-y-6">
                {hypotheses.diagnosticsEvoquer.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Diagnostics à évoquer</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {hypotheses.diagnosticsEvoquer.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {hypotheses.criteresOrientation.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Critères d&apos;orientation</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {hypotheses.criteresOrientation.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Arbre décisionnel */}
          {orientation.arbreDecisionnel && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Arbre décisionnel</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{orientation.arbreDecisionnel}</p>
            </section>
          )}

          {/* Pièges */}
          {orientation.pieges && orientation.pieges.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pièges à éviter</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {orientation.pieges.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Quand adresser */}
          {orientation.quandAdresser && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quand adresser au spécialiste</h2>
              <p className="text-gray-700 leading-relaxed">{orientation.quandAdresser}</p>
            </section>
          )}

          {/* Références */}
          {orientation.references && orientation.references.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Références</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {orientation.references.map((reference, index) => (
                  <li key={index} className="text-sm">{reference}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Mise à jour */}
          {orientation.miseAJour && (
            <div className="text-center text-sm text-gray-500">
              Dernière mise à jour: {new Date(orientation.miseAJour).toLocaleDateString('fr-FR', {
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
