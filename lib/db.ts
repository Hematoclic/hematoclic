import { supabase } from './supabase'
import { FichePathologique } from './types/fiche-pathologique'
import { SituationGrave } from './types/situation-grave'
import { SituationFrequente } from './types/situation-frequente'
import { OrientationDiagnostique } from './types/orientation-diagnostique'

/**
 * Types de catégories (arborescence partagée `categories`), un par section
 * de contenu. Source de vérité unique pour éviter les oublis de site d'usage.
 */
export type CategoryType = 'fiches' | 'situations' | 'frequentes' | 'orientations'

// =============================================
// Types pour la base de données
// =============================================

interface DbFichePathologique {
  id: string
  categorie: string
  informations_generales: {
    nom: string
    definition: string
    physiopathologie: string
    epidemiologie: string
  }
  clinique: {
    presentationClinique: string[]
  }
  biologie: {
    anomaliesHemogramme: string[]
    autresAnomaliesBiologiques: string[]
    myelogramme: string
    autresExamens: string[]
  }
  diagnostic: {
    criteresDiagnostiques: string[]
    diagnosticsDifferentiels: string[]
  }
  conduite_a_tenir: {
    mesuresImmediates: string[]
    precautions: string[]
  }
  traitement_et_suivi: {
    traitement: string[]
    complications: string[]
    suivi: string[]
    evolution: string
    pronostic: string
  }
  bibliographie: string[]
  mise_a_jour: string
  created_at: string
  updated_at: string
}

interface DbSituationGrave {
  id: string
  nom: string
  categorie: string
  niveau_urgence: 'critique' | 'urgent' | 'grave'
  description: string
  contexte: string
  signes_cliniques: {
    symptomes: string[]
    signes: string[]
    signesVitaux: string[]
  }
  examens_complementaires: {
    examensUrgents: string[]
    examensSecondaires: string[]
    valeursCritiques: Array<{ parametre: string; valeur: string; interpretation: string }>
  }
  conduite_a_tenir: {
    mesuresImmediates: string[]
    traitementUrgent: Array<{ nom: string; description: string; posologie?: string }>
    surveillance: string[]
    precautions: string[]
  }
  complications: string[]
  pronostic: string
  bibliographie: string[]
  mise_a_jour: string
  created_at: string
  updated_at: string
}

// =============================================
// Conversion DB -> App
// =============================================

function dbToFichePathologique(db: DbFichePathologique): FichePathologique {
  return {
    id: db.id,
    categorie: db.categorie,
    informationsGenerales: {
      nom: db.informations_generales.nom,
      definition: db.informations_generales.definition,
      physiopathologie: db.informations_generales.physiopathologie,
      epidemiologie: db.informations_generales.epidemiologie,
    },
    clinique: {
      presentationClinique: db.clinique.presentationClinique,
    },
    biologie: {
      anomaliesHemogramme: db.biologie.anomaliesHemogramme,
      autresAnomaliesBiologiques: db.biologie.autresAnomaliesBiologiques,
      myelogramme: db.biologie.myelogramme,
      autresExamens: db.biologie.autresExamens,
    },
    diagnostic: {
      criteresDiagnostiques: db.diagnostic.criteresDiagnostiques,
      diagnosticsDifferentiels: db.diagnostic.diagnosticsDifferentiels,
    },
    conduiteATenir: {
      mesuresImmediates: db.conduite_a_tenir.mesuresImmediates,
      precautions: db.conduite_a_tenir.precautions,
    },
    traitementEtSuivi: {
      traitement: db.traitement_et_suivi.traitement,
      complications: db.traitement_et_suivi.complications,
      suivi: db.traitement_et_suivi.suivi,
      evolution: db.traitement_et_suivi.evolution,
      pronostic: db.traitement_et_suivi.pronostic,
    },
    references: db.bibliographie,
    miseAJour: db.mise_a_jour,
  }
}

function dbToSituationGrave(db: DbSituationGrave): SituationGrave {
  return {
    id: db.id,
    nom: db.nom,
    categorie: db.categorie,
    niveauUrgence: db.niveau_urgence,
    description: db.description,
    contexte: db.contexte,
    signesCliniques: {
      symptomes: db.signes_cliniques.symptomes,
      signes: db.signes_cliniques.signes,
      signesVitaux: db.signes_cliniques.signesVitaux,
    },
    examensComplementaires: {
      examensUrgents: db.examens_complementaires.examensUrgents,
      examensSecondaires: db.examens_complementaires.examensSecondaires,
      valeursCritiques: db.examens_complementaires.valeursCritiques,
    },
    conduiteATenir: {
      mesuresImmediates: db.conduite_a_tenir.mesuresImmediates,
      traitementUrgent: db.conduite_a_tenir.traitementUrgent,
      surveillance: db.conduite_a_tenir.surveillance,
      precautions: db.conduite_a_tenir.precautions,
    },
    complications: db.complications,
    pronostic: db.pronostic,
    references: db.bibliographie,
    miseAJour: db.mise_a_jour,
  }
}

// =============================================
// FICHES PATHOLOGIQUES
// =============================================

const DEFAULT_PAGE_SIZE = 200
const MAX_PAGE_SIZE = 500

function clampLimit(limit: number): number {
  if (!Number.isFinite(limit) || limit <= 0) return DEFAULT_PAGE_SIZE
  return Math.min(Math.floor(limit), MAX_PAGE_SIZE)
}

export async function getFichesPathologiques(
  limit: number = DEFAULT_PAGE_SIZE,
  offset = 0,
): Promise<FichePathologique[]> {
  const safeLimit = clampLimit(limit)
  const safeOffset = Math.max(0, Math.floor(offset))
  const { data, error } = await supabase
    .from('fiches_pathologiques')
    .select('*')
    .order('created_at', { ascending: false })
    .range(safeOffset, safeOffset + safeLimit - 1)

  if (error) {
    console.error('Erreur lors de la récupération des fiches:', error)
    return []
  }

  return (data as DbFichePathologique[]).map(dbToFichePathologique)
}

export async function getFichePathologiqueById(id: string): Promise<FichePathologique | null> {
  const { data, error } = await supabase
    .from('fiches_pathologiques')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erreur lors de la récupération de la fiche:', error)
    return null
  }

  return dbToFichePathologique(data as DbFichePathologique)
}

export async function createFichePathologique(fiche: Omit<FichePathologique, 'id'>): Promise<{ success: boolean; id?: string; error?: string }> {
  const dbFiche = {
    categorie: fiche.categorie,
    informations_generales: {
      nom: fiche.informationsGenerales.nom,
      definition: fiche.informationsGenerales.definition,
      physiopathologie: fiche.informationsGenerales.physiopathologie,
      epidemiologie: fiche.informationsGenerales.epidemiologie,
    },
    clinique: {
      presentationClinique: fiche.clinique.presentationClinique,
    },
    biologie: {
      anomaliesHemogramme: fiche.biologie.anomaliesHemogramme,
      autresAnomaliesBiologiques: fiche.biologie.autresAnomaliesBiologiques,
      myelogramme: fiche.biologie.myelogramme,
      autresExamens: fiche.biologie.autresExamens,
    },
    diagnostic: {
      criteresDiagnostiques: fiche.diagnostic.criteresDiagnostiques,
      diagnosticsDifferentiels: fiche.diagnostic.diagnosticsDifferentiels,
    },
    conduite_a_tenir: {
      mesuresImmediates: fiche.conduiteATenir.mesuresImmediates,
      precautions: fiche.conduiteATenir.precautions,
    },
    traitement_et_suivi: {
      traitement: fiche.traitementEtSuivi.traitement,
      complications: fiche.traitementEtSuivi.complications,
      suivi: fiche.traitementEtSuivi.suivi,
      evolution: fiche.traitementEtSuivi.evolution,
      pronostic: fiche.traitementEtSuivi.pronostic,
    },
    bibliographie: fiche.references || [],
  }

  const { data, error } = await supabase
    .from('fiches_pathologiques')
    .insert(dbFiche)
    .select('id')
    .single()

  if (error) {
    console.error('Erreur lors de la création de la fiche:', error)
    return { success: false, error: error.message }
  }

  return { success: true, id: data.id }
}

export async function updateFichePathologique(id: string, fiche: Partial<FichePathologique>): Promise<{ success: boolean; error?: string }> {
  const updates: Record<string, unknown> = {}

  if (fiche.categorie) updates.categorie = fiche.categorie
  if (fiche.informationsGenerales) updates.informations_generales = fiche.informationsGenerales
  if (fiche.clinique) updates.clinique = fiche.clinique
  if (fiche.biologie) updates.biologie = fiche.biologie
  if (fiche.diagnostic) updates.diagnostic = fiche.diagnostic
  if (fiche.conduiteATenir) updates.conduite_a_tenir = fiche.conduiteATenir
  if (fiche.traitementEtSuivi) updates.traitement_et_suivi = fiche.traitementEtSuivi
  if (fiche.references) updates.bibliographie = fiche.references
  updates.mise_a_jour = new Date().toISOString()

  const { error } = await supabase
    .from('fiches_pathologiques')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la mise à jour de la fiche:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteFichePathologique(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('fiches_pathologiques')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la suppression de la fiche:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =============================================
// SITUATIONS GRAVES
// =============================================

export async function getSituationsGraves(
  limit: number = DEFAULT_PAGE_SIZE,
  offset = 0,
): Promise<SituationGrave[]> {
  const safeLimit = clampLimit(limit)
  const safeOffset = Math.max(0, Math.floor(offset))
  const { data, error } = await supabase
    .from('situations_graves')
    .select('*')
    .order('nom')
    .range(safeOffset, safeOffset + safeLimit - 1)

  if (error) {
    console.error('Erreur lors de la récupération des situations:', error)
    return []
  }

  return (data as DbSituationGrave[]).map(dbToSituationGrave)
}

export async function getSituationGraveById(id: string): Promise<SituationGrave | null> {
  const { data, error } = await supabase
    .from('situations_graves')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erreur lors de la récupération de la situation:', error)
    return null
  }

  return dbToSituationGrave(data as DbSituationGrave)
}

export async function createSituationGrave(situation: Omit<SituationGrave, 'id'>): Promise<{ success: boolean; id?: string; error?: string }> {
  const dbSituation = {
    nom: situation.nom,
    categorie: situation.categorie,
    niveau_urgence: situation.niveauUrgence,
    description: situation.description,
    contexte: situation.contexte,
    signes_cliniques: {
      symptomes: situation.signesCliniques.symptomes,
      signes: situation.signesCliniques.signes,
      signesVitaux: situation.signesCliniques.signesVitaux || [],
    },
    examens_complementaires: {
      examensUrgents: situation.examensComplementaires.examensUrgents,
      examensSecondaires: situation.examensComplementaires.examensSecondaires || [],
      valeursCritiques: situation.examensComplementaires.valeursCritiques || [],
    },
    conduite_a_tenir: {
      mesuresImmediates: situation.conduiteATenir.mesuresImmediates,
      traitementUrgent: situation.conduiteATenir.traitementUrgent,
      surveillance: situation.conduiteATenir.surveillance,
      precautions: situation.conduiteATenir.precautions || [],
    },
    complications: situation.complications || [],
    pronostic: situation.pronostic || '',
    bibliographie: situation.references || [],
  }

  const { data, error } = await supabase
    .from('situations_graves')
    .insert(dbSituation)
    .select('id')
    .single()

  if (error) {
    console.error('Erreur lors de la création de la situation:', error)
    return { success: false, error: error.message }
  }

  return { success: true, id: data.id }
}

export async function updateSituationGrave(id: string, situation: Partial<SituationGrave>): Promise<{ success: boolean; error?: string }> {
  const updates: Record<string, unknown> = {}

  if (situation.nom) updates.nom = situation.nom
  if (situation.categorie) updates.categorie = situation.categorie
  if (situation.niveauUrgence) updates.niveau_urgence = situation.niveauUrgence
  if (situation.description !== undefined) updates.description = situation.description
  if (situation.contexte !== undefined) updates.contexte = situation.contexte
  if (situation.signesCliniques) updates.signes_cliniques = situation.signesCliniques
  if (situation.examensComplementaires) updates.examens_complementaires = situation.examensComplementaires
  if (situation.conduiteATenir) updates.conduite_a_tenir = situation.conduiteATenir
  if (situation.complications) updates.complications = situation.complications
  if (situation.pronostic !== undefined) updates.pronostic = situation.pronostic
  if (situation.references) updates.bibliographie = situation.references
  updates.mise_a_jour = new Date().toISOString()

  const { error } = await supabase
    .from('situations_graves')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la mise à jour de la situation:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteSituationGrave(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('situations_graves')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la suppression de la situation:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =============================================
// CATEGORIES / DOSSIERS
// =============================================

export interface Category {
  id: string
  nom: string
  type: CategoryType
  parentId: string | null
  createdAt: string
  updatedAt: string
}

interface DbCategory {
  id: string
  nom: string
  type: CategoryType
  parent_id: string | null
  created_at: string
  updated_at: string
}

function dbToCategory(db: DbCategory): Category {
  return {
    id: db.id,
    nom: db.nom,
    type: db.type,
    parentId: db.parent_id,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  }
}

/**
 * Walk a list of categories following the names in `path`.
 * Path is interpreted as ordered names from root to leaf.
 * Returns null if any segment cannot be matched.
 */
export function findCategoryByPath(
  categories: Category[],
  path: string[],
): Category | null {
  let currentId: string | null = null
  let currentCategory: Category | null = null
  for (const name of path) {
    const found = categories.find(
      (c: Category) => c.nom === name && c.parentId === currentId,
    )
    if (!found) return null
    currentCategory = found
    currentId = found.id
  }
  return currentCategory
}

/**
 * Build the full path (root → leaf) for a given category id.
 * Returns an empty array if the id is not found.
 */
export function buildCategoryPath(categories: Category[], id: string): string[] {
  const byId = new Map(categories.map((c) => [c.id, c]))
  const target = byId.get(id)
  if (!target) return []
  const path: string[] = []
  let current: Category | undefined = target
  while (current) {
    path.unshift(current.nom)
    current = current.parentId ? byId.get(current.parentId) : undefined
  }
  return path
}

export async function getCategories(type: CategoryType): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('type', type)
    .order('nom')

  if (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return []
  }

  return (data || []).map(dbToCategory)
}

export async function createCategory(
  nom: string,
  type: CategoryType,
  parentId: string | null = null
): Promise<{ success: boolean; category?: Category; error?: string }> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      nom,
      type,
      parent_id: parentId,
    })
    .select()
    .single()

  if (error) {
    console.error('Erreur lors de la création de la catégorie:', error)
    return { success: false, error: error.message }
  }

  return { success: true, category: dbToCategory(data) }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function renameCategory(id: string, newName: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('categories')
    .update({ nom: newName })
    .eq('id', id)

  if (error) {
    console.error('Erreur lors du renommage de la catégorie:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =============================================
// TICKETS
// =============================================

export interface Ticket {
  id: string
  email: string
  sujet: string
  message: string
  statut: 'nouveau' | 'lu' | 'resolu'
  createdAt: string
  updatedAt: string
}

interface DbTicket {
  id: string
  email: string
  sujet: string
  message: string
  statut: 'nouveau' | 'lu' | 'resolu'
  created_at: string
  updated_at: string
}

function dbToTicket(db: DbTicket): Ticket {
  return {
    id: db.id,
    email: db.email,
    sujet: db.sujet,
    message: db.message,
    statut: db.statut,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  }
}

export async function getTickets(
  limit: number = DEFAULT_PAGE_SIZE,
  offset = 0,
): Promise<Ticket[]> {
  const safeLimit = clampLimit(limit)
  const safeOffset = Math.max(0, Math.floor(offset))
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })
    .range(safeOffset, safeOffset + safeLimit - 1)

  if (error) {
    console.error('Erreur lors de la récupération des tickets:', error)
    return []
  }

  return (data || []).map(dbToTicket)
}

export async function createTicket(
  email: string,
  sujet: string,
  message: string
): Promise<{ success: boolean; ticket?: Ticket; error?: string }> {
  const { data, error } = await supabase
    .from('tickets')
    .insert({ email, sujet, message })
    .select()
    .single()

  if (error) {
    console.error('Erreur lors de la création du ticket:', error)
    return { success: false, error: error.message }
  }

  return { success: true, ticket: dbToTicket(data) }
}

export async function deleteTicket(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la suppression du ticket:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateTicketStatut(id: string, statut: 'nouveau' | 'lu' | 'resolu'): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('tickets')
    .update({ statut })
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =============================================
// SITUATIONS FRÉQUENTES
// =============================================

interface DbSituationFrequente {
  id: string
  nom: string
  categorie: string
  description: string
  contexte: string
  signes_cliniques: {
    symptomes: string[]
    signes: string[]
  }
  examens_complementaires: {
    examensRecommandes: string[]
    valeursCles: string[]
  }
  conduite_a_tenir: {
    mesures: string[]
    traitement: string[]
    surveillance: string[]
    precautions: string[]
  }
  complications: string[]
  pronostic: string
  bibliographie: string[]
  mise_a_jour: string
  created_at: string
  updated_at: string
}

function dbToSituationFrequente(db: DbSituationFrequente): SituationFrequente {
  const signes = db.signes_cliniques ?? { symptomes: [], signes: [] }
  const examens = db.examens_complementaires ?? { examensRecommandes: [], valeursCles: [] }
  const conduite = db.conduite_a_tenir ?? { mesures: [], traitement: [], surveillance: [], precautions: [] }
  return {
    id: db.id,
    nom: db.nom,
    categorie: db.categorie,
    description: db.description,
    contexte: db.contexte,
    signesCliniques: {
      symptomes: signes.symptomes ?? [],
      signes: signes.signes ?? [],
    },
    examensComplementaires: {
      examensRecommandes: examens.examensRecommandes ?? [],
      valeursCles: examens.valeursCles ?? [],
    },
    conduiteATenir: {
      mesures: conduite.mesures ?? [],
      traitement: conduite.traitement ?? [],
      surveillance: conduite.surveillance ?? [],
      precautions: conduite.precautions ?? [],
    },
    complications: db.complications ?? [],
    pronostic: db.pronostic,
    references: db.bibliographie ?? [],
    miseAJour: db.mise_a_jour,
  }
}

export async function getSituationsFrequentes(
  limit: number = DEFAULT_PAGE_SIZE,
  offset = 0,
): Promise<SituationFrequente[]> {
  const safeLimit = clampLimit(limit)
  const safeOffset = Math.max(0, Math.floor(offset))
  const { data, error } = await supabase
    .from('situations_frequentes')
    .select('*')
    .order('nom')
    .range(safeOffset, safeOffset + safeLimit - 1)

  if (error) {
    console.error('Erreur lors de la récupération des situations fréquentes:', error)
    return []
  }

  return (data as DbSituationFrequente[]).map(dbToSituationFrequente)
}

export async function getSituationFrequenteById(id: string): Promise<SituationFrequente | null> {
  const { data, error } = await supabase
    .from('situations_frequentes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erreur lors de la récupération de la situation fréquente:', error)
    return null
  }

  return dbToSituationFrequente(data as DbSituationFrequente)
}

export async function createSituationFrequente(
  situation: Omit<SituationFrequente, 'id'>,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const dbSituation = {
    nom: situation.nom,
    categorie: situation.categorie,
    description: situation.description,
    contexte: situation.contexte,
    signes_cliniques: {
      symptomes: situation.signesCliniques.symptomes,
      signes: situation.signesCliniques.signes,
    },
    examens_complementaires: {
      examensRecommandes: situation.examensComplementaires.examensRecommandes,
      valeursCles: situation.examensComplementaires.valeursCles,
    },
    conduite_a_tenir: {
      mesures: situation.conduiteATenir.mesures,
      traitement: situation.conduiteATenir.traitement,
      surveillance: situation.conduiteATenir.surveillance,
      precautions: situation.conduiteATenir.precautions,
    },
    complications: situation.complications || [],
    pronostic: situation.pronostic || '',
    bibliographie: situation.references || [],
  }

  const { data, error } = await supabase
    .from('situations_frequentes')
    .insert(dbSituation)
    .select('id')
    .single()

  if (error) {
    console.error('Erreur lors de la création de la situation fréquente:', error)
    return { success: false, error: error.message }
  }

  return { success: true, id: data.id }
}

export async function updateSituationFrequente(
  id: string,
  situation: Partial<SituationFrequente>,
): Promise<{ success: boolean; error?: string }> {
  const updates: Record<string, unknown> = {}

  if (situation.nom) updates.nom = situation.nom
  if (situation.categorie) updates.categorie = situation.categorie
  if (situation.description !== undefined) updates.description = situation.description
  if (situation.contexte !== undefined) updates.contexte = situation.contexte
  if (situation.signesCliniques) updates.signes_cliniques = situation.signesCliniques
  if (situation.examensComplementaires) updates.examens_complementaires = situation.examensComplementaires
  if (situation.conduiteATenir) updates.conduite_a_tenir = situation.conduiteATenir
  if (situation.complications) updates.complications = situation.complications
  if (situation.pronostic !== undefined) updates.pronostic = situation.pronostic
  if (situation.references) updates.bibliographie = situation.references
  updates.mise_a_jour = new Date().toISOString()

  const { error } = await supabase
    .from('situations_frequentes')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la mise à jour de la situation fréquente:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteSituationFrequente(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('situations_frequentes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la suppression de la situation fréquente:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =============================================
// ORIENTATIONS DIAGNOSTIQUES
// =============================================

interface DbOrientationDiagnostique {
  id: string
  nom: string
  categorie: string
  description: string
  signes_dappel: string[]
  demarche: {
    etapes: string[]
    questionsAnamnese: string[]
    signesRechercher: string[]
  }
  examens: {
    premiereIntention: string[]
    secondeIntention: string[]
  }
  hypotheses: {
    diagnosticsEvoquer: string[]
    criteresOrientation: string[]
  }
  arbre_decisionnel: string
  pieges: string[]
  quand_adresser: string
  bibliographie: string[]
  mise_a_jour: string
  created_at: string
  updated_at: string
}

function dbToOrientationDiagnostique(db: DbOrientationDiagnostique): OrientationDiagnostique {
  const demarche = db.demarche ?? { etapes: [], questionsAnamnese: [], signesRechercher: [] }
  const examens = db.examens ?? { premiereIntention: [], secondeIntention: [] }
  const hypotheses = db.hypotheses ?? { diagnosticsEvoquer: [], criteresOrientation: [] }
  return {
    id: db.id,
    nom: db.nom,
    categorie: db.categorie,
    description: db.description,
    signesDappel: db.signes_dappel ?? [],
    demarche: {
      etapes: demarche.etapes ?? [],
      questionsAnamnese: demarche.questionsAnamnese ?? [],
      signesRechercher: demarche.signesRechercher ?? [],
    },
    examens: {
      premiereIntention: examens.premiereIntention ?? [],
      secondeIntention: examens.secondeIntention ?? [],
    },
    hypotheses: {
      diagnosticsEvoquer: hypotheses.diagnosticsEvoquer ?? [],
      criteresOrientation: hypotheses.criteresOrientation ?? [],
    },
    arbreDecisionnel: db.arbre_decisionnel,
    pieges: db.pieges ?? [],
    quandAdresser: db.quand_adresser,
    references: db.bibliographie ?? [],
    miseAJour: db.mise_a_jour,
  }
}

export async function getOrientationsDiagnostiques(
  limit: number = DEFAULT_PAGE_SIZE,
  offset = 0,
): Promise<OrientationDiagnostique[]> {
  const safeLimit = clampLimit(limit)
  const safeOffset = Math.max(0, Math.floor(offset))
  const { data, error } = await supabase
    .from('orientations_diagnostiques')
    .select('*')
    .order('nom')
    .range(safeOffset, safeOffset + safeLimit - 1)

  if (error) {
    console.error('Erreur lors de la récupération des orientations diagnostiques:', error)
    return []
  }

  return (data as DbOrientationDiagnostique[]).map(dbToOrientationDiagnostique)
}

export async function getOrientationDiagnostiqueById(id: string): Promise<OrientationDiagnostique | null> {
  const { data, error } = await supabase
    .from('orientations_diagnostiques')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erreur lors de la récupération de l\'orientation diagnostique:', error)
    return null
  }

  return dbToOrientationDiagnostique(data as DbOrientationDiagnostique)
}

export async function createOrientationDiagnostique(
  orientation: Omit<OrientationDiagnostique, 'id'>,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const dbOrientation = {
    nom: orientation.nom,
    categorie: orientation.categorie,
    description: orientation.description,
    signes_dappel: orientation.signesDappel || [],
    demarche: {
      etapes: orientation.demarche.etapes,
      questionsAnamnese: orientation.demarche.questionsAnamnese,
      signesRechercher: orientation.demarche.signesRechercher,
    },
    examens: {
      premiereIntention: orientation.examens.premiereIntention,
      secondeIntention: orientation.examens.secondeIntention,
    },
    hypotheses: {
      diagnosticsEvoquer: orientation.hypotheses.diagnosticsEvoquer,
      criteresOrientation: orientation.hypotheses.criteresOrientation,
    },
    arbre_decisionnel: orientation.arbreDecisionnel || '',
    pieges: orientation.pieges || [],
    quand_adresser: orientation.quandAdresser || '',
    bibliographie: orientation.references || [],
  }

  const { data, error } = await supabase
    .from('orientations_diagnostiques')
    .insert(dbOrientation)
    .select('id')
    .single()

  if (error) {
    console.error('Erreur lors de la création de l\'orientation diagnostique:', error)
    return { success: false, error: error.message }
  }

  return { success: true, id: data.id }
}

export async function updateOrientationDiagnostique(
  id: string,
  orientation: Partial<OrientationDiagnostique>,
): Promise<{ success: boolean; error?: string }> {
  const updates: Record<string, unknown> = {}

  if (orientation.nom) updates.nom = orientation.nom
  if (orientation.categorie) updates.categorie = orientation.categorie
  if (orientation.description !== undefined) updates.description = orientation.description
  if (orientation.signesDappel) updates.signes_dappel = orientation.signesDappel
  if (orientation.demarche) updates.demarche = orientation.demarche
  if (orientation.examens) updates.examens = orientation.examens
  if (orientation.hypotheses) updates.hypotheses = orientation.hypotheses
  if (orientation.arbreDecisionnel !== undefined) updates.arbre_decisionnel = orientation.arbreDecisionnel
  if (orientation.pieges) updates.pieges = orientation.pieges
  if (orientation.quandAdresser !== undefined) updates.quand_adresser = orientation.quandAdresser
  if (orientation.references) updates.bibliographie = orientation.references
  updates.mise_a_jour = new Date().toISOString()

  const { error } = await supabase
    .from('orientations_diagnostiques')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la mise à jour de l\'orientation diagnostique:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteOrientationDiagnostique(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('orientations_diagnostiques')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la suppression de l\'orientation diagnostique:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =============================================
// LEGAL PAGES (mentions légales, CGU, confidentialité…)
// =============================================

export interface LegalPage {
  id: string
  slug: string
  title: string
  content: string
  updatedAt: string
}

interface DbLegalPage {
  id: string
  slug: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

function dbToLegalPage(db: DbLegalPage): LegalPage {
  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    content: db.content,
    updatedAt: db.updated_at,
  }
}

export async function getLegalPages(): Promise<LegalPage[]> {
  const { data, error } = await supabase
    .from('legal_pages')
    .select('*')
    .order('slug')

  if (error) {
    console.error('Erreur lors de la récupération des pages légales:', error)
    return []
  }

  return (data as DbLegalPage[]).map(dbToLegalPage)
}

export async function getLegalPageBySlug(slug: string): Promise<LegalPage | null> {
  const { data, error } = await supabase
    .from('legal_pages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('Erreur lors de la récupération de la page légale:', error)
    return null
  }

  return data ? dbToLegalPage(data as DbLegalPage) : null
}

export async function upsertLegalPage(
  slug: string,
  title: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('legal_pages')
    .upsert({ slug, title, content }, { onConflict: 'slug' })

  if (error) {
    console.error('Erreur lors de l\'enregistrement de la page légale:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =============================================
// SITE SETTINGS (paramètres/contenus éditoriaux clé-valeur)
// =============================================

export interface SiteSetting {
  key: string
  value: string
  updatedAt: string
}

interface DbSiteSetting {
  id: string
  key: string
  value: string
  created_at: string
  updated_at: string
}

function dbToSiteSetting(db: DbSiteSetting): SiteSetting {
  return {
    key: db.key,
    value: db.value,
    updatedAt: db.updated_at,
  }
}

export async function getSiteSettings(): Promise<SiteSetting[]> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('key')

  if (error) {
    console.error('Erreur lors de la récupération des réglages:', error)
    return []
  }

  return (data as DbSiteSetting[]).map(dbToSiteSetting)
}

export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .maybeSingle()

  if (error) {
    console.error('Erreur lors de la récupération du réglage:', error)
    return null
  }

  return data ? dbToSiteSetting(data as DbSiteSetting) : null
}

export async function updateSiteSetting(
  key: string,
  value: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' })

  if (error) {
    console.error('Erreur lors de l\'enregistrement du réglage:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =============================================
// COMPTEURS EXACTS (dashboard) — count côté serveur, non plafonné
// =============================================

async function countTable(table: string): Promise<number> {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error(`Erreur lors du comptage de ${table}:`, error)
    return 0
  }

  return count ?? 0
}

export const countFichesPathologiques = () => countTable('fiches_pathologiques')
export const countSituationsGraves = () => countTable('situations_graves')
export const countSituationsFrequentes = () => countTable('situations_frequentes')
export const countOrientationsDiagnostiques = () => countTable('orientations_diagnostiques')
