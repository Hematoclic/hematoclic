/**
 * Type applicatif d'une Orientation Diagnostique.
 *
 * Quoi : démarche diagnostique à partir d'un point d'appel clinique ou
 *   biologique (ex: "Anémie microcytaire").
 * Pourquoi : structure adaptée au domaine (signes d'appel → démarche →
 *   examens → hypothèses → arbre → pièges), distincte d'une fiche.
 * Comment : consommé par les pages publiques et l'admin ; converti
 *   depuis/vers la table `orientations_diagnostiques` dans lib/db.ts.
 */
export interface OrientationDiagnostique {
  id: string;
  nom: string;
  categorie: string;
  description: string;
  signesDappel: string[];
  demarche: {
    etapes: string[];
    questionsAnamnese: string[];
    signesRechercher: string[];
  };
  examens: {
    premiereIntention: string[];
    secondeIntention: string[];
  };
  hypotheses: {
    diagnosticsEvoquer: string[];
    criteresOrientation: string[];
  };
  arbreDecisionnel?: string;
  pieges?: string[];
  quandAdresser?: string;
  references?: string[];
  miseAJour?: string;
}
