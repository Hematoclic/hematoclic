'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  createOrientationDiagnostique,
  updateOrientationDiagnostique,
  getCategories,
  Category,
} from '@/lib/db'
import { OrientationDiagnostique } from '@/lib/types/orientation-diagnostique'
import { flattenCategoriesWithPath } from '@/lib/folder-tree'

/**
 * Formulaire partagé Orientation Diagnostique (création + édition).
 *
 * Quoi : orchestrateur unique du formulaire, réutilisé par new/ et [id]/edit/.
 * Pourquoi : DRY — une seule source pour la saisie, le mapping et le submit.
 * Comment : formData plat (listes = textarea \n-séparées) ; submit →
 *   createOrientationDiagnostique | updateOrientationDiagnostique → redirection.
 */
interface OrientationFormProps {
  mode: 'create' | 'edit'
  id?: string
  initial?: OrientationDiagnostique
  initialCategorie?: string
}

const INPUT_CLASS =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors'
const TEXTAREA_CLASS = `${INPUT_CLASS} resize-none`

function buildInitialFormData(initial?: OrientationDiagnostique, initialCategorie?: string) {
  return {
    nom: initial?.nom ?? '',
    categorie: initial?.categorie ?? initialCategorie ?? '',
    description: initial?.description ?? '',
    signesDappel: (initial?.signesDappel ?? []).join('\n'),
    etapes: (initial?.demarche.etapes ?? []).join('\n'),
    questionsAnamnese: (initial?.demarche.questionsAnamnese ?? []).join('\n'),
    signesRechercher: (initial?.demarche.signesRechercher ?? []).join('\n'),
    premiereIntention: (initial?.examens.premiereIntention ?? []).join('\n'),
    secondeIntention: (initial?.examens.secondeIntention ?? []).join('\n'),
    diagnosticsEvoquer: (initial?.hypotheses.diagnosticsEvoquer ?? []).join('\n'),
    criteresOrientation: (initial?.hypotheses.criteresOrientation ?? []).join('\n'),
    arbreDecisionnel: initial?.arbreDecisionnel ?? '',
    pieges: (initial?.pieges ?? []).join('\n'),
    quandAdresser: initial?.quandAdresser ?? '',
    references: (initial?.references ?? []).join('\n'),
  }
}

export default function OrientationForm({ mode, id, initial, initialCategorie }: OrientationFormProps) {
  const router = useRouter()
  const [dbCategories, setDbCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState(() => buildInitialFormData(initial, initialCategorie))

  useEffect(() => {
    getCategories('orientations').then(setDbCategories)
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

    const payload: Omit<OrientationDiagnostique, 'id'> = {
      nom: formData.nom,
      categorie: formData.categorie,
      description: formData.description,
      signesDappel: toList(formData.signesDappel),
      demarche: {
        etapes: toList(formData.etapes),
        questionsAnamnese: toList(formData.questionsAnamnese),
        signesRechercher: toList(formData.signesRechercher),
      },
      examens: {
        premiereIntention: toList(formData.premiereIntention),
        secondeIntention: toList(formData.secondeIntention),
      },
      hypotheses: {
        diagnosticsEvoquer: toList(formData.diagnosticsEvoquer),
        criteresOrientation: toList(formData.criteresOrientation),
      },
      arbreDecisionnel: formData.arbreDecisionnel,
      pieges: toList(formData.pieges),
      quandAdresser: formData.quandAdresser,
      references: toList(formData.references),
    }

    const result =
      mode === 'edit' && id
        ? await updateOrientationDiagnostique(id, payload)
        : await createOrientationDiagnostique(payload)

    if (result.success) {
      router.push('/admin/orientation-diagnostique')
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
          href="/admin/orientation-diagnostique"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'edit' ? 'Modifier l\'Orientation Diagnostique' : 'Nouvelle Orientation Diagnostique'}
          </h1>
          <p className="text-gray-600 mt-1">Démarche diagnostique à partir d&apos;un point d&apos;appel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations générales */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Point d&apos;appel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Ex: Anémie microcytaire"
                className={INPUT_CLASS}
              />
            </div>
            <div className="md:col-span-2">
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
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Contexte et intérêt de cette orientation..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signes d&apos;appel (un par ligne)
              </label>
              <textarea
                name="signesDappel"
                value={formData.signesDappel}
                onChange={handleChange}
                rows={3}
                placeholder="VGM < 80 fL&#10;Pâleur cutanéo-muqueuse..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Démarche diagnostique */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Démarche diagnostique</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Étapes (une par ligne)
              </label>
              <textarea
                name="etapes"
                value={formData.etapes}
                onChange={handleChange}
                rows={4}
                placeholder="Confirmer la microcytose&#10;Doser la ferritine..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Questions d&apos;anamnèse (une par ligne)
              </label>
              <textarea
                name="questionsAnamnese"
                value={formData.questionsAnamnese}
                onChange={handleChange}
                rows={3}
                placeholder="Saignements ? Régime alimentaire ? Antécédents..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signes à rechercher (un par ligne)
              </label>
              <textarea
                name="signesRechercher"
                value={formData.signesRechercher}
                onChange={handleChange}
                rows={3}
                placeholder="Signes de carence martiale&#10;Syndrome inflammatoire..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Examens */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Examens</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Première intention (un par ligne)
              </label>
              <textarea
                name="premiereIntention"
                value={formData.premiereIntention}
                onChange={handleChange}
                rows={3}
                placeholder="Ferritine&#10;CRP&#10;Bilan martial..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seconde intention (un par ligne)
              </label>
              <textarea
                name="secondeIntention"
                value={formData.secondeIntention}
                onChange={handleChange}
                rows={3}
                placeholder="Électrophorèse de l'hémoglobine&#10;Endoscopie digestive..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Hypothèses diagnostiques */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hypothèses diagnostiques</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnostics à évoquer (un par ligne)
              </label>
              <textarea
                name="diagnosticsEvoquer"
                value={formData.diagnosticsEvoquer}
                onChange={handleChange}
                rows={3}
                placeholder="Carence martiale&#10;Thalassémie&#10;Anémie inflammatoire..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Critères d&apos;orientation (un par ligne)
              </label>
              <textarea
                name="criteresOrientation"
                value={formData.criteresOrientation}
                onChange={handleChange}
                rows={3}
                placeholder="Ferritine basse → carence&#10;Ferritine normale/haute → autre cause..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Arbre décisionnel & pièges */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Synthèse</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arbre décisionnel (texte libre)
              </label>
              <textarea
                name="arbreDecisionnel"
                value={formData.arbreDecisionnel}
                onChange={handleChange}
                rows={5}
                placeholder="Décrivez la logique décisionnelle étape par étape..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pièges à éviter (un par ligne)
              </label>
              <textarea
                name="pieges"
                value={formData.pieges}
                onChange={handleChange}
                rows={3}
                placeholder="Ne pas confondre carence et thalassémie&#10;Ferritine faussement normale si inflammation..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quand adresser au spécialiste
              </label>
              <textarea
                name="quandAdresser"
                value={formData.quandAdresser}
                onChange={handleChange}
                rows={2}
                placeholder="En cas de doute diagnostique, d'anomalie persistante..."
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
              placeholder="Auteur et al. Journal 2024&#10;Recommandations HAS 2024..."
              className={TEXTAREA_CLASS}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/orientation-diagnostique"
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
                <span>{mode === 'edit' ? 'Enregistrer les modifications' : 'Créer l\'orientation'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
