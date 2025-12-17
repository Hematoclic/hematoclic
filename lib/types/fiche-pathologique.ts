export interface FichePathologique {
  id: string;
  nom: string;
  categorie: string;
  description: string;
  caracteristiquesCliniques: {
    symptomes: string[];
    signes: string[];
    presentation: string;
    evolution: string;
  };
  caracteristiquesBiologiques: {
    hemogramme: {
      description: string;
      anomalies: string[];
    };
    marqueurs: string[];
    examensComplementaires: string[];
    criteresDiagnostiques: string[];
  };
  caracteristiquesTherapeutiques: {
    traitementPremiereLigne: string[];
    traitementDeuxiemeLigne?: string[];
    protocoles: Array<{
      nom: string;
      description: string;
      indications: string[];
    }>;
    suivi: string[];
    pronostic: string;
  };
  references?: string[];
  miseAJour?: string;
}

