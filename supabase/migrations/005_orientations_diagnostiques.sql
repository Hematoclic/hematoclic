-- =============================================
-- Migration 005 — Orientations diagnostiques (orientations_diagnostiques)
--
-- Démarche diagnostique à partir d'un point d'appel clinique ou
-- biologique (ex: "Anémie microcytaire", "Thrombopénie isolée").
-- Structure ADAPTÉE au domaine (pas un clone d'une fiche) :
--   signes d'appel → démarche → examens 1re/2e intention → hypothèses
--   → arbre décisionnel → pièges → quand adresser.
-- Lecture publique, écritures réservées aux admins (is_admin()).
--
-- DEFAULT JSONB structurés (clés présentes, tableaux vides) pour éviter
-- tout `undefined` à la lecture des sous-clés côté application.
-- =============================================

CREATE TABLE IF NOT EXISTS orientations_diagnostiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Point d'appel diagnostique, ex: "Anémie microcytaire"
  nom VARCHAR(255) NOT NULL,
  categorie VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  signes_dappel TEXT[] NOT NULL DEFAULT '{}',
  -- { etapes: string[], questionsAnamnese: string[], signesRechercher: string[] }
  demarche JSONB NOT NULL DEFAULT '{"etapes":[],"questionsAnamnese":[],"signesRechercher":[]}'::jsonb,
  -- { premiereIntention: string[], secondeIntention: string[] }
  examens JSONB NOT NULL DEFAULT '{"premiereIntention":[],"secondeIntention":[]}'::jsonb,
  -- { diagnosticsEvoquer: string[], criteresOrientation: string[] }
  hypotheses JSONB NOT NULL DEFAULT '{"diagnosticsEvoquer":[],"criteresOrientation":[]}'::jsonb,
  arbre_decisionnel TEXT NOT NULL DEFAULT '',
  pieges TEXT[] NOT NULL DEFAULT '{}',
  quand_adresser TEXT NOT NULL DEFAULT '',
  bibliographie TEXT[] NOT NULL DEFAULT '{}',
  mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orientations_categorie ON orientations_diagnostiques(categorie);
CREATE INDEX IF NOT EXISTS idx_orientations_nom ON orientations_diagnostiques(nom);
CREATE INDEX IF NOT EXISTS idx_orientations_demarche_gin ON orientations_diagnostiques USING GIN (demarche);

DROP TRIGGER IF EXISTS orientations_diagnostiques_updated_at ON orientations_diagnostiques;
CREATE TRIGGER orientations_diagnostiques_updated_at
  BEFORE UPDATE ON orientations_diagnostiques
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE orientations_diagnostiques ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture orientations pour tous" ON orientations_diagnostiques;
CREATE POLICY "Lecture orientations pour tous" ON orientations_diagnostiques
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Création orientations admin" ON orientations_diagnostiques;
CREATE POLICY "Création orientations admin" ON orientations_diagnostiques
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Modification orientations admin" ON orientations_diagnostiques;
CREATE POLICY "Modification orientations admin" ON orientations_diagnostiques
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Suppression orientations admin" ON orientations_diagnostiques;
CREATE POLICY "Suppression orientations admin" ON orientations_diagnostiques
  FOR DELETE TO authenticated
  USING (is_admin());
