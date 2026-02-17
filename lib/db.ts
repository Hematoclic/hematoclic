import { supabase } from './supabase'
import { FichePathologique } from './types/fiche-pathologique'
import { SituationGrave } from './types/situation-grave'

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

export async function getFichesPathologiques(): Promise<FichePathologique[]> {
  const { data, error } = await supabase
    .from('fiches_pathologiques')
    .select('*')
    .order('created_at', { ascending: false })

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

export async function getSituationsGraves(): Promise<SituationGrave[]> {
  const { data, error } = await supabase
    .from('situations_graves')
    .select('*')
    .order('nom')

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
  if (situation.description) updates.description = situation.description
  if (situation.contexte) updates.contexte = situation.contexte
  if (situation.signesCliniques) updates.signes_cliniques = situation.signesCliniques
  if (situation.examensComplementaires) updates.examens_complementaires = situation.examensComplementaires
  if (situation.conduiteATenir) updates.conduite_a_tenir = situation.conduiteATenir
  if (situation.complications) updates.complications = situation.complications
  if (situation.pronostic) updates.pronostic = situation.pronostic
  if (situation.references) updates.bibliographie = situation.references

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
  type: 'fiches' | 'situations'
  parentId: string | null
  createdAt: string
  updatedAt: string
}

interface DbCategory {
  id: string
  nom: string
  type: 'fiches' | 'situations'
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

export async function getCategories(type: 'fiches' | 'situations'): Promise<Category[]> {
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
  type: 'fiches' | 'situations',
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
