-- =============================================
-- Migration 004 — Situations fréquentes (situations_frequentes)
--
-- Situations cliniques courantes (non urgentes) rencontrées en
-- pratique hématologique. Structure calquée sur situations_graves
-- MAIS sans niveau_urgence : démarche clinique → examens → prise en
-- charge. Lecture publique, écritures réservées aux admins (is_admin()).
--
-- Les DEFAULT JSONB sont structurés (clés présentes avec tableaux
-- vides) pour éviter tout `undefined` lors de la lecture des sous-clés
-- côté application (converters dbTo* de lib/db.ts).
-- =============================================

CREATE TABLE IF NOT EXISTS situations_frequentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  categorie VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  contexte TEXT NOT NULL DEFAULT '',
  -- { symptomes: string[], signes: string[] }
  signes_cliniques JSONB NOT NULL DEFAULT '{"symptomes":[],"signes":[]}'::jsonb,
  -- { examensRecommandes: string[], valeursCles: string[] }
  examens_complementaires JSONB NOT NULL DEFAULT '{"examensRecommandes":[],"valeursCles":[]}'::jsonb,
  -- { mesures: string[], traitement: string[], surveillance: string[], precautions: string[] }
  conduite_a_tenir JSONB NOT NULL DEFAULT '{"mesures":[],"traitement":[],"surveillance":[],"precautions":[]}'::jsonb,
  complications TEXT[] NOT NULL DEFAULT '{}',
  pronostic TEXT NOT NULL DEFAULT '',
  bibliographie TEXT[] NOT NULL DEFAULT '{}',
  mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_situations_freq_categorie ON situations_frequentes(categorie);
CREATE INDEX IF NOT EXISTS idx_situations_freq_nom ON situations_frequentes(nom);
CREATE INDEX IF NOT EXISTS idx_situations_freq_signes_gin ON situations_frequentes USING GIN (signes_cliniques);

DROP TRIGGER IF EXISTS situations_frequentes_updated_at ON situations_frequentes;
CREATE TRIGGER situations_frequentes_updated_at
  BEFORE UPDATE ON situations_frequentes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE situations_frequentes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture situations fréquentes pour tous" ON situations_frequentes;
CREATE POLICY "Lecture situations fréquentes pour tous" ON situations_frequentes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Création situations fréquentes admin" ON situations_frequentes;
CREATE POLICY "Création situations fréquentes admin" ON situations_frequentes
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Modification situations fréquentes admin" ON situations_frequentes;
CREATE POLICY "Modification situations fréquentes admin" ON situations_frequentes
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Suppression situations fréquentes admin" ON situations_frequentes;
CREATE POLICY "Suppression situations fréquentes admin" ON situations_frequentes
  FOR DELETE TO authenticated
  USING (is_admin());
