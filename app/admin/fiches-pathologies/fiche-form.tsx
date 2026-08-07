'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  createFichePathologique,
  updateFichePathologique,
  getCategories,
  Category,
} from '@/lib/db'
import { FichePathologique } from '@/lib/types/fiche-pathologique'
import { flattenCategoriesWithPath } from '@/lib/folder-tree'

/**
 * Formulaire partagé Fiche Pathologique (création + édition).
 *
 * Quoi : orchestrateur unique du formulaire, réutilisé par new/ et [id]/edit/.
 * Pourquoi : DRY + corrige les routes d'édition manquantes (bouton "Modifier").
 * Comment : formData plat (listes = textarea \n-séparées) ; submit →
 *   createFichePathologique | updateFichePathologique → redirection.
 */
interface FicheFormProps {
  mode: 'create' | 'edit'
  id?: string
  initial?: FichePathologique
  initialCategorie?: string
}

const INPUT_CLASS =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors'
const TEXTAREA_CLASS = `${INPUT_CLASS} resize-none`

function buildInitialFormData(initial?: FichePathologique, initialCategorie?: string) {
  return {
    nom: initial?.informationsGenerales.nom ?? '',
    categorie: initial?.categorie ?? initialCategorie ?? '',
    definition: initial?.informationsGenerales.definition ?? '',
    physiopathologie: initial?.informationsGenerales.physiopathologie ?? '',
    epidemiologie: initial?.informationsGenerales.epidemiologie ?? '',
    presentationClinique: (initial?.clinique.presentationClinique ?? []).join('\n'),
    anomaliesHemogramme: (initial?.biologie.anomaliesHemogramme ?? []).join('\n'),
    autresAnomaliesBiologiques: (initial?.biologie.autresAnomaliesBiologiques ?? []).join('\n'),
    myelogramme: initial?.biologie.myelogramme ?? '',
    autresExamens: (initial?.biologie.autresExamens ?? []).join('\n'),
    criteresDiagnostiques: (initial?.diagnostic.criteresDiagnostiques ?? []).join('\n'),
    diagnosticsDifferentiels: (initial?.diagnostic.diagnosticsDifferentiels ?? []).join('\n'),
    mesuresImmediates: (initial?.conduiteATenir.mesuresImmediates ?? []).join('\n'),
    precautions: (initial?.conduiteATenir.precautions ?? []).join('\n'),
    traitement: (initial?.traitementEtSuivi.traitement ?? []).join('\n'),
    complications: (initial?.traitementEtSuivi.complications ?? []).join('\n'),
    suivi: (initial?.traitementEtSuivi.suivi ?? []).join('\n'),
    evolution: initial?.traitementEtSuivi.evolution ?? '',
    pronostic: initial?.traitementEtSuivi.pronostic ?? '',
    references: (initial?.references ?? []).join('\n'),
  }
}

export default function FicheForm({ mode, id, initial, initialCategorie }: FicheFormProps) {
  const router = useRouter()
  const [dbCategories, setDbCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState(() => buildInitialFormData(initial, initialCategorie))

  useEffect(() => {
    getCategories('fiches').then(setDbCategories)
  }, [])

  const categoryOptions = flattenCategoriesWithPath(dbCategories)
  const selectedCategorie = formData.categorie
  const hasCategoryInOptions = categoryOptions.some((c) => c.name === selectedCategorie)
  if (selectedCategorie && !hasCategoryInOptions) {
    categoryOptions.unshift({ id: `__current__${selectedCategorie}`, name: selectedCategorie, pathLabel: selectedCategorie })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toList = (value: string) => value.split('\n').filter((s) => s.trim())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const ficheData: Omit<FichePathologique, 'id'> = {
      categorie: formData.categorie,
      informationsGenerales: {
        nom: formData.nom,
        definition: formData.definition,
        physiopathologie: formData.physiopathologie,
        epidemiologie: formData.epidemiologie,
      },
      clinique: {
        presentationClinique: toList(formData.presentationClinique),
      },
      biologie: {
        anomaliesHemogramme: toList(formData.anomaliesHemogramme),
        autresAnomaliesBiologiques: toList(formData.autresAnomaliesBiologiques),
        myelogramme: formData.myelogramme,
        autresExamens: toList(formData.autresExamens),
      },
      diagnostic: {
        criteresDiagnostiques: toList(formData.criteresDiagnostiques),
        diagnosticsDifferentiels: toList(formData.diagnosticsDifferentiels),
      },
      conduiteATenir: {
        mesuresImmediates: toList(formData.mesuresImmediates),
        precautions: toList(formData.precautions),
      },
      traitementEtSuivi: {
        traitement: toList(formData.traitement),
        complications: toList(formData.complications),
        suivi: toList(formData.suivi),
        evolution: formData.evolution,
        pronostic: formData.pronostic,
      },
      references: toList(formData.references),
    }

    const result =
      mode === 'edit' && id
        ? await updateFichePathologique(id, ficheData)
        : await createFichePathologique(ficheData)

    if (result.success) {
      router.push('/admin/fiches-pathologies')
      router.refresh()
    } else {
      setError(result.error || 'Une erreur est survenue')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
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
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'edit' ? 'Modifier la Fiche Pathologie' : 'Nouvelle Fiche Pathologie'}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === 'edit' ? 'Mettez à jour la fiche pathologique' : 'Créez une nouvelle fiche pathologique'}
          </p>
        </div>
      </div>

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
                className={INPUT_CLASS}
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
                className={INPUT_CLASS}
              >
                <option value="">Sélectionner une catégorie</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.pathLabel}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Définition <span className="text-red-500">*</span>
              </label>
              <textarea
                name="definition"
                value={formData.definition}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Définition de la pathologie..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Physiopathologie
              </label>
              <textarea
                name="physiopathologie"
                value={formData.physiopathologie}
                onChange={handleChange}
                rows={3}
                placeholder="Mécanismes physiopathologiques..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Épidémiologie
              </label>
              <textarea
                name="epidemiologie"
                value={formData.epidemiologie}
                onChange={handleChange}
                rows={2}
                placeholder="Données épidémiologiques..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Clinique */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Clinique</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Présentation clinique (une par ligne)
              </label>
              <textarea
                name="presentationClinique"
                value={formData.presentationClinique}
                onChange={handleChange}
                rows={4}
                placeholder="Fatigue intense&#10;Fièvre&#10;Saignements&#10;Syndrome tumoral..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Biologie */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Biologie</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anomalies de l&apos;hémogramme (une par ligne)
              </label>
              <textarea
                name="anomaliesHemogramme"
                value={formData.anomaliesHemogramme}
                onChange={handleChange}
                rows={3}
                placeholder="Anémie normochrome normocytaire&#10;Thrombopénie&#10;Neutropénie..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autres anomalies biologiques (une par ligne)
              </label>
              <textarea
                name="autresAnomaliesBiologiques"
                value={formData.autresAnomaliesBiologiques}
                onChange={handleChange}
                rows={3}
                placeholder="LDH augmentée&#10;Hyperuricémie..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Myélogramme
              </label>
              <textarea
                name="myelogramme"
                value={formData.myelogramme}
                onChange={handleChange}
                rows={2}
                placeholder="Description du myélogramme..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autres examens biologiques (un par ligne)
              </label>
              <textarea
                name="autresExamens"
                value={formData.autresExamens}
                onChange={handleChange}
                rows={3}
                placeholder="Caryotype médullaire&#10;Biologie moléculaire&#10;Immunophénotypage..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Diagnostic */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Diagnostic</h2>
          <div className="space-y-4">
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
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnostics différentiels (un par ligne)
              </label>
              <textarea
                name="diagnosticsDifferentiels"
                value={formData.diagnosticsDifferentiels}
                onChange={handleChange}
                rows={3}
                placeholder="Diagnostic différentiel 1&#10;Diagnostic différentiel 2..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Conduite à tenir */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Conduite à tenir</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mesures immédiates (une par ligne)
              </label>
              <textarea
                name="mesuresImmediates"
                value={formData.mesuresImmediates}
                onChange={handleChange}
                rows={3}
                placeholder="Hospitalisation&#10;Bilan complet..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Précautions (une par ligne)
              </label>
              <textarea
                name="precautions"
                value={formData.precautions}
                onChange={handleChange}
                rows={3}
                placeholder="Éviter les AINS&#10;Surveillance rapprochée..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Traitement et suivi */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Traitement et suivi</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Traitement (un par ligne)
              </label>
              <textarea
                name="traitement"
                value={formData.traitement}
                onChange={handleChange}
                rows={3}
                placeholder="Chimiothérapie d'induction&#10;Consolidation&#10;Allogreffe..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complications (une par ligne)
              </label>
              <textarea
                name="complications"
                value={formData.complications}
                onChange={handleChange}
                rows={3}
                placeholder="Neutropénie fébrile&#10;Syndrome de lyse tumorale..."
                className={TEXTAREA_CLASS}
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
                className={TEXTAREA_CLASS}
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
                placeholder="Évolution naturelle et sous traitement..."
                className={TEXTAREA_CLASS}
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
                className={TEXTAREA_CLASS}
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
              className={TEXTAREA_CLASS}
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
                <span>{mode === 'edit' ? 'Enregistrement...' : 'Création...'}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{mode === 'edit' ? 'Enregistrer les modifications' : 'Créer la fiche'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
