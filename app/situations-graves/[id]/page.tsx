import Link from 'next/link'
import Header from '../../components/Header'
import { getSituationGraveById } from '@/lib/db'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

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

export default async function SituationGraveDetail({ params }: PageProps) {
  const { id } = await params
  const situation = await getSituationGraveById(id)

  if (!situation) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Back button */}
        <Link 
          href="/situations-graves"
          className="inline-flex items-center text-gray-600 hover:text-[#a50000] transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux situations
        </Link>

        {/* Header de la situation */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-block px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-full">
              {situation.categorie}
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getUrgenceColor(situation.niveauUrgence)}`}>
              {situation.niveauUrgence.toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {situation.nom}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-4">
            {situation.description}
          </p>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-gray-700">
              <span className="font-semibold">Contexte: </span>
              {situation.contexte}
            </p>
          </div>
        </section>

        {/* Contenu de la situation */}
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Signes Cliniques */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Signes Cliniques
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Symptômes</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {situation.signesCliniques.symptomes.map((symptome, index) => (
                    <li key={index}>{symptome}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Signes</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {situation.signesCliniques.signes.map((signe, index) => (
                    <li key={index}>{signe}</li>
                  ))}
                </ul>
              </div>

              {situation.signesCliniques.signesVitaux && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Signes Vitaux</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {situation.signesCliniques.signesVitaux.map((signe, index) => (
                      <li key={index}>{signe}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Examens Complémentaires */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Examens Complémentaires
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Examens Urgents</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {situation.examensComplementaires.examensUrgents.map((examen, index) => (
                    <li key={index}>{examen}</li>
                  ))}
                </ul>
              </div>

              {situation.examensComplementaires.examensSecondaires && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Examens Secondaires</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {situation.examensComplementaires.examensSecondaires.map((examen, index) => (
                      <li key={index}>{examen}</li>
                    ))}
                  </ul>
                </div>
              )}

              {situation.examensComplementaires.valeursCritiques && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Valeurs Critiques</h3>
                  <div className="space-y-3">
                    {situation.examensComplementaires.valeursCritiques.map((valeur, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="font-semibold text-gray-900 mb-1">
                          {valeur.parametre}: <span className="text-red-600">{valeur.valeur}</span>
                        </div>
                        <div className="text-sm text-gray-700">{valeur.interpretation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Conduite à Tenir */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Conduite à Tenir
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Mesures Immédiates</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {situation.conduiteATenir.mesuresImmediates.map((mesure, index) => (
                    <li key={index}>{mesure}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Traitement Urgent</h3>
                <div className="space-y-4">
                  {situation.conduiteATenir.traitementUrgent.map((traitement, index) => (
                    <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-2">{traitement.nom}</h4>
                      <p className="text-gray-700 mb-2">{traitement.description}</p>
                      {traitement.posologie && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Posologie: </span>
                          <span className="text-sm text-gray-700">{traitement.posologie}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Surveillance</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {situation.conduiteATenir.surveillance.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {situation.conduiteATenir.precautions && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Précautions</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {situation.conduiteATenir.precautions.map((precaution, index) => (
                      <li key={index}>{precaution}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Complications */}
          {situation.complications && situation.complications.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Complications</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {situation.complications.map((complication, index) => (
                  <li key={index}>{complication}</li>
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
                day: 'numeric' 
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

