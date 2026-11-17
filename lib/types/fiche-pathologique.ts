export interface FichePathologique {
  id: string;
  
  // Informations générales
  informationsGenerales: {
    nom: string;
    definition: string;
    physiopathologie: string;
    epidemiologie: string;
  };
  
  categorie: string;
  
  // Clinique
  clinique: {
    presentationClinique: string[];
  };
  
  // Biologie
  biologie: {
    anomaliesHemogramme: string[];
    autresAnomaliesBiologiques: string[];
    myelogramme: string;
    autresExamens: string[];
  };
  
  // Diagnostic
  diagnostic: {
    criteresDiagnostiques: string[];
    diagnosticsDifferentiels: string[];
  };
  
  // Conduite à tenir
  conduiteATenir: {
    mesuresImmediates: string[];
    precautions: string[];
  };
  
  // Traitement et suivi
  traitementEtSuivi: {
    traitement: string[];
    complications: string[];
    suivi: string[];
    evolution: string;
    pronostic: string;
  };
  
  references?: string[];
  miseAJour?: string;
}
