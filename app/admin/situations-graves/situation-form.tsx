'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  createSituationGrave,
  updateSituationGrave,
  getCategories,
  Category,
} from '@/lib/db'
import { SituationGrave } from '@/lib/types/situation-grave'
import { flattenCategoriesWithPath } from '@/lib/folder-tree'

/**
 * Formulaire partagé Situation Grave (création + édition).
 *
 * Quoi : orchestrateur unique du formulaire, réutilisé par new/ et [id]/edit/.
 * Pourquoi : DRY + corrige la route d'édition manquante (bouton "Modifier").
 * Comment : formData plat (listes = textarea \n-séparées). En édition, les
 *   champs NON exposés au form (traitementUrgent[], valeursCritiques[]) sont
 *   ré-injectés depuis `initial` pour ne pas être écrasés par l'update.
 */
interface SituationFormProps {
  mode: 'create' | 'edit'
  id?: string
  initial?: SituationGrave
  initialCategorie?: string
}

const INPUT_CLASS =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a50000]/20 focus:border-[#a50000] transition-colors'
const TEXTAREA_CLASS = `${INPUT_CLASS} resize-none`

const NIVEAUX_URGENCE = [
  { value: 'critique', label: 'Critique', description: 'Mise en jeu du pronostic vital immédiat' },
  { value: 'urgent', label: 'Urgent', description: 'Prise en charge dans les heures' },
  { value: 'grave', label: 'Grave', description: 'Surveillance rapprochée nécessaire' },
]

function buildInitialFormData(initial?: SituationGrave, initialCategorie?: string) {
  return {
    nom: initial?.nom ?? '',
    categorie: initial?.categorie ?? initialCategorie ?? '',
    niveauUrgence: initial?.niveauUrgence ?? '',
    description: initial?.description ?? '',
    contexte: initial?.contexte ?? '',
    symptomes: (initial?.signesCliniques.symptomes ?? []).join('\n'),
    signes: (initial?.signesCliniques.signes ?? []).join('\n'),
    signesVitaux: (initial?.signesCliniques.signesVitaux ?? []).join('\n'),
    examensUrgents: (initial?.examensComplementaires.examensUrgents ?? []).join('\n'),
    examensSecondaires: (initial?.examensComplementaires.examensSecondaires ?? []).join('\n'),
    mesuresImmediates: (initial?.conduiteATenir.mesuresImmediates ?? []).join('\n'),
    surveillance: (initial?.conduiteATenir.surveillance ?? []).join('\n'),
    precautions: (initial?.conduiteATenir.precautions ?? []).join('\n'),
    complications: (initial?.complications ?? []).join('\n'),
    pronostic: initial?.pronostic ?? '',
    references: (initial?.references ?? []).join('\n'),
  }
}

export default function SituationForm({ mode, id, initial, initialCategorie }: SituationFormProps) {
  const router = useRouter()
  const [dbCategories, setDbCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState(() => buildInitialFormData(initial, initialCategorie))

  useEffect(() => {
    getCategories('situations').then(setDbCategories)
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

    const payload: Omit<SituationGrave, 'id'> = {
      nom: formData.nom,
      categorie: formData.categorie,
      niveauUrgence: formData.niveauUrgence as 'critique' | 'urgent' | 'grave',
      description: formData.description,
      contexte: formData.contexte,
      signesCliniques: {
        symptomes: toList(formData.symptomes),
        signes: toList(formData.signes),
        signesVitaux: toList(formData.signesVitaux),
      },
      examensComplementaires: {
        examensUrgents: toList(formData.examensUrgents),
        examensSecondaires: toList(formData.examensSecondaires),
        // Champ non exposé au formulaire : préservé depuis l'existant.
        valeursCritiques: initial?.examensComplementaires.valeursCritiques ?? [],
      },
      conduiteATenir: {
        mesuresImmediates: toList(formData.mesuresImmediates),
        // Champ non exposé au formulaire : préservé depuis l'existant.
        traitementUrgent: initial?.conduiteATenir.traitementUrgent ?? [],
        surveillance: toList(formData.surveillance),
        precautions: toList(formData.precautions),
      },
      complications: toList(formData.complications),
      pronostic: formData.pronostic,
      references: toList(formData.references),
    }

    const result =
      mode === 'edit' && id
        ? await updateSituationGrave(id, payload)
        : await createSituationGrave(payload)

    if (result.success) {
      router.push('/admin/situations-graves')
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
          href="/admin/situations-graves"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'edit' ? 'Modifier la Situation Grave' : 'Nouvelle Situation Grave'}
          </h1>
          <p className="text-gray-600 mt-1">Documentez une situation d&apos;urgence</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations générales */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la situation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Ex: Syndrome de Lyse Tumorale (SLT)"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau d&apos;urgence <span className="text-red-500">*</span>
              </label>
              <select
                name="niveauUrgence"
                value={formData.niveauUrgence}
                onChange={handleChange}
                required
                className={INPUT_CLASS}
              >
                <option value="">Sélectionner un niveau</option>
                {NIVEAUX_URGENCE.map((niveau) => (
                  <option key={niveau.value} value={niveau.value}>
                    {niveau.label} - {niveau.description}
                  </option>
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
                placeholder="Description de la situation d'urgence..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contexte de survenue
              </label>
              <textarea
                name="contexte"
                value={formData.contexte}
                onChange={handleChange}
                rows={2}
                placeholder="Dans quel contexte cette situation survient-elle..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Signes cliniques */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Signes cliniques</h2>
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
                placeholder="Nausées et vomissements&#10;Fatigue intense&#10;Confusion..."
                className={TEXTAREA_CLASS}
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
                placeholder="Hyperkaliémie&#10;Hyperphosphatémie&#10;Insuffisance rénale aiguë..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signes vitaux à surveiller (un par ligne)
              </label>
              <textarea
                name="signesVitaux"
                value={formData.signesVitaux}
                onChange={handleChange}
                rows={3}
                placeholder="Troubles du rythme cardiaque&#10;Hypotension&#10;Tachypnée..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Examens complémentaires */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Examens complémentaires</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Examens urgents (un par ligne)
              </label>
              <textarea
                name="examensUrgents"
                value={formData.examensUrgents}
                onChange={handleChange}
                rows={4}
                placeholder="Ionogramme sanguin&#10;ECG&#10;Gaz du sang..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Examens secondaires (un par ligne)
              </label>
              <textarea
                name="examensSecondaires"
                value={formData.examensSecondaires}
                onChange={handleChange}
                rows={3}
                placeholder="Examens à réaliser dans un second temps..."
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
                Mesures immédiates (une par ligne) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="mesuresImmediates"
                value={formData.mesuresImmediates}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Hospitalisation en soins intensifs&#10;Monitorage cardiaque continu&#10;Hyperhydratation..."
                className={TEXTAREA_CLASS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surveillance (une par ligne)
              </label>
              <textarea
                name="surveillance"
                value={formData.surveillance}
                onChange={handleChange}
                rows={3}
                placeholder="Diurèse horaire&#10;Ionogramme toutes les 4h&#10;ECG quotidien..."
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
                placeholder="Précautions particulières à prendre..."
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* Complications et pronostic */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Complications et pronostic</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complications possibles (une par ligne)
              </label>
              <textarea
                name="complications"
                value={formData.complications}
                onChange={handleChange}
                rows={3}
                placeholder="Insuffisance rénale aiguë&#10;Arrêt cardiaque&#10;Décès..."
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
                placeholder="Pronostic et facteurs de risque..."
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
            href="/admin/situations-graves"
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
                <span>{mode === 'edit' ? 'Enregistrer les modifications' : 'Créer la situation'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
