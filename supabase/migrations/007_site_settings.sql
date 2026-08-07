-- =============================================
-- Migration 007 — Paramètres du site (site_settings)
--
-- Table clé/valeur pour les contenus éditoriaux dynamiques du site,
-- éditables sans redéploiement. `value` peut contenir du HTML assaini
-- (ex: encart éditorial de la page d'accueil, clé 'home-intro').
-- Lecture publique, écritures réservées aux admins (is_admin()).
-- =============================================

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture réglages pour tous" ON site_settings;
CREATE POLICY "Lecture réglages pour tous" ON site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Création réglages admin" ON site_settings;
CREATE POLICY "Création réglages admin" ON site_settings
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Modification réglages admin" ON site_settings;
CREATE POLICY "Modification réglages admin" ON site_settings
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Suppression réglages admin" ON site_settings;
CREATE POLICY "Suppression réglages admin" ON site_settings
  FOR DELETE TO authenticated
  USING (is_admin());

-- Encart éditorial de la page d'accueil (idempotent, vide par défaut :
-- l'encart n'est affiché que s'il contient du texte).
INSERT INTO site_settings (key, value)
VALUES ('home-intro', '')
ON CONFLICT (key) DO NOTHING;
