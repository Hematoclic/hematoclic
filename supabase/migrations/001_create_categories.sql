-- Table pour stocker les catégories/dossiers
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('fiches', 'situations')),
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(nom, type, parent_id)
);

-- Index pour les recherches par type
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Lecture catégories pour tous" ON categories
  FOR SELECT
  USING (true);

-- Permettre l'insertion aux utilisateurs authentifiés
CREATE POLICY "Création catégories" ON categories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Modification catégories" ON categories
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Suppression catégories" ON categories
  FOR DELETE
  USING (auth.role() = 'authenticated');
