import Link from 'next/link'
import Header from '../../components/Header'
import { getFichePathologiqueById } from '@/lib/db'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function FichePathologiqueDetail({ params }: PageProps) {
  const { id } = await params
  const fiche = await getFichePathologiqueById(id)

  if (!fiche) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Back button */}
        <Link 
          href="/fiches-pathologies"
          className="inline-flex items-center text-gray-600 hover:text-[#a50000] transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux fiches
        </Link>

        {/* Header de la fiche */}
        <section className="mb-8">
          <div className="inline-block px-4 py-2 bg-[#a50000]/10 text-[#a50000] text-sm font-medium rounded-full mb-4">
            {fiche.categorie}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {fiche.informationsGenerales.nom}
          </h1>
        </section>

        {/* Contenu de la fiche */}
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* 1. Informations Générales */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[#a50000]/10 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-[#a50000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Informations Générales
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Définition</h3>
                <p className="text-gray-700 leading-relaxed">{fiche.informationsGenerales.definition}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Physiopathologie</h3>
                <p className="text-gray-700 leading-relaxed">{fiche.informationsGenerales.physiopathologie}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Épidémiologie</h3>
                <p className="text-gray-700 leading-relaxed">{fiche.informationsGenerales.epidemiologie}</p>
              </div>
            </div>
          </section>

          {/* 2. Clinique */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Clinique
              </h2>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Présentation Clinique</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {fiche.clinique.presentationClinique.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* 3. Biologie */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Biologie
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Anomalies de l&apos;hémogramme</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {fiche.biologie.anomaliesHemogramme.map((anomalie, index) => (
                    <li key={index}>{anomalie}</li>
                  ))}
                </ul>
              </div>

              {fiche.biologie.autresAnomaliesBiologiques.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Autres anomalies biologiques</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {fiche.biologie.autresAnomaliesBiologiques.map((anomalie, index) => (
                      <li key={index}>{anomalie}</li>
                    ))}
                  </ul>
                </div>
              )}

              {fiche.biologie.myelogramme && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Myélogramme</h3>
                  <p className="text-gray-700 leading-relaxed">{fiche.biologie.myelogramme}</p>
                </div>
              )}

              {fiche.biologie.autresExamens.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Autres examens biologiques</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {fiche.biologie.autresExamens.map((examen, index) => (
                      <li key={index}>{examen}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* 4. Diagnostic */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Diagnostic
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Critères diagnostiques</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {fiche.diagnostic.criteresDiagnostiques.map((critere, index) => (
                    <li key={index}>{critere}</li>
                  ))}
                </ul>
              </div>

              {fiche.diagnostic.diagnosticsDifferentiels.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Diagnostics différentiels</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {fiche.diagnostic.diagnosticsDifferentiels.map((diag, index) => (
                      <li key={index}>{diag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* 5. Conduite à tenir */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Conduite à tenir
              </h2>
            </div>

            <div className="space-y-6">
              {fiche.conduiteATenir.mesuresImmediates.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Mesures immédiates</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {fiche.conduiteATenir.mesuresImmediates.map((mesure, index) => (
                      <li key={index}>{mesure}</li>
                    ))}
                  </ul>
                </div>
              )}

              {fiche.conduiteATenir.precautions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Précautions</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {fiche.conduiteATenir.precautions.map((precaution, index) => (
                      <li key={index}>{precaution}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* 6. Traitement et suivi */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Traitement et suivi
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Traitement</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {fiche.traitementEtSuivi.traitement.map((traitement, index) => (
                    <li key={index}>{traitement}</li>
                  ))}
                </ul>
              </div>

              {fiche.traitementEtSuivi.complications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Complications</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {fiche.traitementEtSuivi.complications.map((complication, index) => (
                      <li key={index}>{complication}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Suivi</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {fiche.traitementEtSuivi.suivi.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {fiche.traitementEtSuivi.evolution && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Évolution</h3>
                  <p className="text-gray-700 leading-relaxed">{fiche.traitementEtSuivi.evolution}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Pronostic</h3>
                <p className="text-gray-700 leading-relaxed">{fiche.traitementEtSuivi.pronostic}</p>
              </div>
            </div>
          </section>

          {/* Références */}
          {fiche.references && fiche.references.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Références</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {fiche.references.map((reference, index) => (
                  <li key={index} className="text-sm">{reference}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Mise à jour */}
          {fiche.miseAJour && (
            <div className="text-center text-sm text-gray-500">
              Dernière mise à jour: {new Date(fiche.miseAJour).toLocaleDateString('fr-FR', { 
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

