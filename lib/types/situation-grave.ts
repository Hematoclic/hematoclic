export interface SituationGrave {
  id: string;
  nom: string;
  categorie: string;
  niveauUrgence: 'critique' | 'urgent' | 'grave';
  description: string;
  contexte: string;
  signesCliniques: {
    symptomes: string[];
    signes: string[];
    signesVitaux?: string[];
  };
  examensComplementaires: {
    examensUrgents: string[];
    examensSecondaires?: string[];
    valeursCritiques?: Array<{
      parametre: string;
      valeur: string;
      interpretation: string;
    }>;
  };
  conduiteATenir: {
    mesuresImmediates: string[];
    traitementUrgent: Array<{
      nom: string;
      description: string;
      posologie?: string;
    }>;
    surveillance: string[];
    precautions?: string[];
  };
  complications?: string[];
  pronostic?: string;
  references?: string[];
  miseAJour?: string;
}

