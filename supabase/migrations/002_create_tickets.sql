-- Table pour stocker les tickets de support
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  sujet VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  statut VARCHAR(50) DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'lu', 'resolu')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_tickets_statut ON tickets(statut);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_tickets_updated_at();

-- RLS Policies
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Permettre l'insertion à tous (pour les visiteurs)
CREATE POLICY "Création tickets pour tous" ON tickets
  FOR INSERT
  WITH CHECK (true);

-- Permettre la lecture aux utilisateurs authentifiés uniquement
CREATE POLICY "Lecture tickets admin" ON tickets
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Modification tickets admin" ON tickets
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Suppression tickets admin" ON tickets
  FOR DELETE
  USING (auth.role() = 'authenticated');
