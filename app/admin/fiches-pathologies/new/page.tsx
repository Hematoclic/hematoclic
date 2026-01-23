'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createFichePathologique } from '@/lib/db'

export default function NewFichePathologie() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nom: '',
    categorie: '',
    description: '',
    // Caractéristiques cliniques
    symptomes: '',
    signes: '',
    presentation: '',
    evolution: '',
    // Caractéristiques biologiques
    hemogrammeDescription: '',
    hemogrammeAnomalies: '',
    marqueurs: '',
    examensComplementaires: '',
    criteresDiagnostiques: '',
    // Caractéristiques thérapeutiques
    traitementPremiereLigne: '',
    traitementDeuxiemeLigne: '',
    suivi: '',
    pronostic: '',
    // Références
    references: '',
  })

  const categories = [
    'Hémopathies malignes',
    'Anémies',
    'Troubles de la coagulation',
    'Pathologies plaquettaires',
    'Syndromes myéloprolifératifs',
    'Syndromes lymphoprolifératifs',
    'Autres',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const ficheData = {
      nom: formData.nom,
      categorie: formData.categorie,
      description: formData.description,
      caracteristiquesCliniques: {
        symptomes: formData.symptomes.split('\n').filter(s => s.trim()),
        signes: formData.signes.split('\n').filter(s => s.trim()),
        presentation: formData.presentation,
        evolution: formData.evolution,
      },
      caracteristiquesBiologiques: {
        hemogramme: {
          description: formData.hemogrammeDescription,
          anomalies: formData.hemogrammeAnomalies.split('\n').filter(s => s.trim()),
        },
        marqueurs: formData.marqueurs.split('\n').filter(s => s.trim()),
        examensComplementaires: formData.examensComplementaires.split('\n').filter(s => s.trim()),
        criteresDiagnostiques: formData.criteresDiagnostiques.split('\n').filter(s => s.trim()),
      },
      caracteristiquesTherapeutiques: {
        traitementPremiereLigne: formData.traitementPremiereLigne.split('\n').filter(s => s.trim()),
        traitementDeuxiemeLigne: formData.traitementDeuxiemeLigne.split('\n').filter(s => s.trim()),
        protocoles: [],
        suivi: formData.suivi.split('\n').filter(s => s.trim()),
        pronostic: formData.pronostic,
      },
      references: formData.references.split('\n').filter(s => s.trim()),
    }

    const result = await createFichePathologique(ficheData)
    
    if (result.success) {
      router.push('/admin/fiches-pathologies')
    } else {
      setError(result.error || 'Une erreur est survenue')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Erreur</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/fiches-pathologies"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle Fiche Pathologie</h1>
          <p className="text-gray-600 mt-1">Créez une nouvelle fiche pathologique</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations générales */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la pathologie <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Ex: Leucémie Aiguë Myéloïde (LAM)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Description générale de la pathologie..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Caractéristiques cliniques */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Caractéristiques cliniques</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symptômes (un par ligne)
              </label>
              <textarea
                name="symptomes"
                value={formData.symptomes}
                onChange={handleChange}
                rows={4}
                placeholder="Fatigue intense&#10;Fièvre&#10;Saignements..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signes cliniques (un par ligne)
              </label>
              <textarea
                name="signes"
                value={formData.signes}
                onChange={handleChange}
                rows={4}
                placeholder="Anémie&#10;Thrombopénie&#10;Neutropénie..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Présentation
              </label>
              <textarea
                name="presentation"
                value={formData.presentation}
                onChange={handleChange}
                rows={2}
                placeholder="Mode de présentation de la pathologie..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Évolution
              </label>
              <textarea
                name="evolution"
                value={formData.evolution}
                onChange={handleChange}
                rows={2}
                placeholder="Évolution naturelle de la maladie..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Caractéristiques biologiques */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Caractéristiques biologiques</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hémogramme - Description
              </label>
              <textarea
                name="hemogrammeDescription"
                value={formData.hemogrammeDescription}
                onChange={handleChange}
                rows={2}
                placeholder="Description des anomalies de l'hémogramme..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hémogramme - Anomalies (une par ligne)
              </label>
              <textarea
                name="hemogrammeAnomalies"
                value={formData.hemogrammeAnomalies}
                onChange={handleChange}
                rows={3}
                placeholder="Anémie normochrome normocytaire&#10;Thrombopénie&#10;Neutropénie..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marqueurs biologiques (un par ligne)
              </label>
              <textarea
                name="marqueurs"
                value={formData.marqueurs}
                onChange={handleChange}
                rows={3}
                placeholder="Blastes médullaires ≥ 20%&#10;Cytogénétique: t(8;21)..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Examens complémentaires (un par ligne)
              </label>
              <textarea
                name="examensComplementaires"
                value={formData.examensComplementaires}
                onChange={handleChange}
                rows={3}
                placeholder="Myélogramme&#10;Caryotype médullaire&#10;Biologie moléculaire..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Critères diagnostiques (un par ligne)
              </label>
              <textarea
                name="criteresDiagnostiques"
                value={formData.criteresDiagnostiques}
                onChange={handleChange}
                rows={3}
                placeholder="Critère 1&#10;Critère 2..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Caractéristiques thérapeutiques */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Caractéristiques thérapeutiques</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Traitement de première ligne (un par ligne)
              </label>
              <textarea
                name="traitementPremiereLigne"
                value={formData.traitementPremiereLigne}
                onChange={handleChange}
                rows={3}
                placeholder="Chimiothérapie d'induction&#10;Consolidation..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Traitement de deuxième ligne (un par ligne)
              </label>
              <textarea
                name="traitementDeuxiemeLigne"
                value={formData.traitementDeuxiemeLigne}
                onChange={handleChange}
                rows={3}
                placeholder="Chimiothérapie de rattrapage&#10;Thérapies ciblées..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suivi (un élément par ligne)
              </label>
              <textarea
                name="suivi"
                value={formData.suivi}
                onChange={handleChange}
                rows={3}
                placeholder="Myélogramme à J15&#10;Évaluation de la rémission..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pronostic
              </label>
              <textarea
                name="pronostic"
                value={formData.pronostic}
                onChange={handleChange}
                rows={2}
                placeholder="Facteurs pronostiques et survie..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Références */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Références</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Références bibliographiques (une par ligne)
            </label>
            <textarea
              name="references"
              value={formData.references}
              onChange={handleChange}
              rows={3}
              placeholder="Auteur et al. Journal 2024&#10;Guidelines ESMO 2024..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/fiches-pathologies"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#a50000] text-white rounded-lg hover:bg-[#8a0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Création...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Créer la fiche</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
