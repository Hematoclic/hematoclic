-- =============================================
-- Migration initiale Hematoclic
-- Schéma complet : categories, fiches_pathologiques,
-- situations_graves, tickets
-- =============================================

-- Extension pour gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- Fonction utilitaire updated_at
-- =============================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TABLE : categories (dossiers / sous-dossiers)
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('fiches', 'situations')),
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(nom, type, parent_id)
);

CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture catégories pour tous" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Création catégories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Modification catégories" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Suppression catégories" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- TABLE : fiches_pathologiques
-- =============================================
CREATE TABLE IF NOT EXISTS fiches_pathologiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categorie VARCHAR(255) NOT NULL,
  informations_generales JSONB NOT NULL DEFAULT '{}'::jsonb,
  clinique JSONB NOT NULL DEFAULT '{}'::jsonb,
  biologie JSONB NOT NULL DEFAULT '{}'::jsonb,
  diagnostic JSONB NOT NULL DEFAULT '{}'::jsonb,
  conduite_a_tenir JSONB NOT NULL DEFAULT '{}'::jsonb,
  traitement_et_suivi JSONB NOT NULL DEFAULT '{}'::jsonb,
  bibliographie TEXT[] NOT NULL DEFAULT '{}',
  mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fiches_categorie ON fiches_pathologiques(categorie);
CREATE INDEX IF NOT EXISTS idx_fiches_created ON fiches_pathologiques(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fiches_infos_gin ON fiches_pathologiques USING GIN (informations_generales);

CREATE TRIGGER fiches_pathologiques_updated_at
  BEFORE UPDATE ON fiches_pathologiques
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE fiches_pathologiques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture fiches pour tous" ON fiches_pathologiques
  FOR SELECT USING (true);

CREATE POLICY "Création fiches" ON fiches_pathologiques
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Modification fiches" ON fiches_pathologiques
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Suppression fiches" ON fiches_pathologiques
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- TABLE : situations_graves
-- =============================================
CREATE TABLE IF NOT EXISTS situations_graves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  categorie VARCHAR(255) NOT NULL,
  niveau_urgence VARCHAR(50) NOT NULL CHECK (niveau_urgence IN ('critique', 'urgent', 'grave')),
  description TEXT NOT NULL DEFAULT '',
  contexte TEXT NOT NULL DEFAULT '',
  signes_cliniques JSONB NOT NULL DEFAULT '{}'::jsonb,
  examens_complementaires JSONB NOT NULL DEFAULT '{}'::jsonb,
  conduite_a_tenir JSONB NOT NULL DEFAULT '{}'::jsonb,
  complications TEXT[] NOT NULL DEFAULT '{}',
  pronostic TEXT NOT NULL DEFAULT '',
  bibliographie TEXT[] NOT NULL DEFAULT '{}',
  mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_situations_categorie ON situations_graves(categorie);
CREATE INDEX IF NOT EXISTS idx_situations_urgence ON situations_graves(niveau_urgence);
CREATE INDEX IF NOT EXISTS idx_situations_nom ON situations_graves(nom);

CREATE TRIGGER situations_graves_updated_at
  BEFORE UPDATE ON situations_graves
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE situations_graves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture situations pour tous" ON situations_graves
  FOR SELECT USING (true);

CREATE POLICY "Création situations" ON situations_graves
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Modification situations" ON situations_graves
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Suppression situations" ON situations_graves
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- TABLE : tickets (support / contact)
-- =============================================
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  sujet VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  statut VARCHAR(50) DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'lu', 'resolu')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_statut ON tickets(statut);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC);

CREATE TRIGGER tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Création tickets pour tous" ON tickets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Lecture tickets admin" ON tickets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Modification tickets admin" ON tickets
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Suppression tickets admin" ON tickets
  FOR DELETE
  TO authenticated
  USING (true);
