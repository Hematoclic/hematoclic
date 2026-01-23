import { supabase } from './supabase'
import { FichePathologique } from './types/fiche-pathologique'
import { SituationGrave } from './types/situation-grave'

// =============================================
// Types pour la base de données
// =============================================

interface DbFichePathologique {
  id: string
  nom: string
  categorie: string
  description: string
  caracteristiques_cliniques: {
    symptomes: string[]
    signes: string[]
    presentation: string
    evolution: string
  }
  caracteristiques_biologiques: {
    hemogramme: { description: string; anomalies: string[] }
    marqueurs: string[]
    examensComplementaires: string[]
    criteresDiagnostiques: string[]
  }
  caracteristiques_therapeutiques: {
    traitementPremiereLigne: string[]
    traitementDeuxiemeLigne: string[]
    protocoles: Array<{ nom: string; description: string; indications: string[] }>
    suivi: string[]
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
    nom: db.nom,
    categorie: db.categorie,
    description: db.description,
    caracteristiquesCliniques: {
      symptomes: db.caracteristiques_cliniques.symptomes,
      signes: db.caracteristiques_cliniques.signes,
      presentation: db.caracteristiques_cliniques.presentation,
      evolution: db.caracteristiques_cliniques.evolution,
    },
    caracteristiquesBiologiques: {
      hemogramme: db.caracteristiques_biologiques.hemogramme,
      marqueurs: db.caracteristiques_biologiques.marqueurs,
      examensComplementaires: db.caracteristiques_biologiques.examensComplementaires,
      criteresDiagnostiques: db.caracteristiques_biologiques.criteresDiagnostiques,
    },
    caracteristiquesTherapeutiques: {
      traitementPremiereLigne: db.caracteristiques_therapeutiques.traitementPremiereLigne,
      traitementDeuxiemeLigne: db.caracteristiques_therapeutiques.traitementDeuxiemeLigne,
      protocoles: db.caracteristiques_therapeutiques.protocoles,
      suivi: db.caracteristiques_therapeutiques.suivi,
      pronostic: db.caracteristiques_therapeutiques.pronostic,
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
    .order('nom')

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
    nom: fiche.nom,
    categorie: fiche.categorie,
    description: fiche.description,
    caracteristiques_cliniques: {
      symptomes: fiche.caracteristiquesCliniques.symptomes,
      signes: fiche.caracteristiquesCliniques.signes,
      presentation: fiche.caracteristiquesCliniques.presentation,
      evolution: fiche.caracteristiquesCliniques.evolution,
    },
    caracteristiques_biologiques: {
      hemogramme: fiche.caracteristiquesBiologiques.hemogramme,
      marqueurs: fiche.caracteristiquesBiologiques.marqueurs,
      examensComplementaires: fiche.caracteristiquesBiologiques.examensComplementaires,
      criteresDiagnostiques: fiche.caracteristiquesBiologiques.criteresDiagnostiques,
    },
    caracteristiques_therapeutiques: {
      traitementPremiereLigne: fiche.caracteristiquesTherapeutiques.traitementPremiereLigne,
      traitementDeuxiemeLigne: fiche.caracteristiquesTherapeutiques.traitementDeuxiemeLigne || [],
      protocoles: fiche.caracteristiquesTherapeutiques.protocoles,
      suivi: fiche.caracteristiquesTherapeutiques.suivi,
      pronostic: fiche.caracteristiquesTherapeutiques.pronostic,
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

  if (fiche.nom) updates.nom = fiche.nom
  if (fiche.categorie) updates.categorie = fiche.categorie
  if (fiche.description) updates.description = fiche.description
  if (fiche.caracteristiquesCliniques) {
    updates.caracteristiques_cliniques = fiche.caracteristiquesCliniques
  }
  if (fiche.caracteristiquesBiologiques) {
    updates.caracteristiques_biologiques = fiche.caracteristiquesBiologiques
  }
  if (fiche.caracteristiquesTherapeutiques) {
    updates.caracteristiques_therapeutiques = fiche.caracteristiquesTherapeutiques
  }
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
