/**
 * Type applicatif d'une Situation Fréquente.
 *
 * Quoi : situation clinique courante (non urgente) en hématologie.
 * Pourquoi : modèle miroir de SituationGrave sans niveau d'urgence,
 *   organisé démarche clinique → examens → prise en charge.
 * Comment : consommé par les pages publiques et l'admin ; converti
 *   depuis/vers la table `situations_frequentes` dans lib/db.ts.
 */
export interface SituationFrequente {
  id: string;
  nom: string;
  categorie: string;
  description: string;
  contexte: string;
  signesCliniques: {
    symptomes: string[];
    signes: string[];
  };
  examensComplementaires: {
    examensRecommandes: string[];
    valeursCles: string[];
  };
  conduiteATenir: {
    mesures: string[];
    traitement: string[];
    surveillance: string[];
    precautions: string[];
  };
  complications?: string[];
  pronostic?: string;
  references?: string[];
  miseAJour?: string;
}
