-- =============================================
-- Migration 006 — Pages légales (legal_pages)
--
-- Pages statiques éditables (mentions légales, CGU, politique de
-- confidentialité...). `content` stocke du HTML assaini produit par
-- l'éditeur riche admin (sanitisation au rendu côté serveur).
-- Lecture publique, écritures réservées aux admins (is_admin()).
--
-- Un gabarit "mentions-legales" est pré-inséré avec des marqueurs
-- [À COMPLÉTER PAR LE CLIENT] : le texte légal factuel (éditeur,
-- directeur de publication, hébergeur, RGPD) reste à la charge du
-- client, éditable depuis l'admin (Contenus du site).
-- =============================================

CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_pages_slug ON legal_pages(slug);

DROP TRIGGER IF EXISTS legal_pages_updated_at ON legal_pages;
CREATE TRIGGER legal_pages_updated_at
  BEFORE UPDATE ON legal_pages
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture pages légales pour tous" ON legal_pages;
CREATE POLICY "Lecture pages légales pour tous" ON legal_pages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Création pages légales admin" ON legal_pages;
CREATE POLICY "Création pages légales admin" ON legal_pages
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Modification pages légales admin" ON legal_pages;
CREATE POLICY "Modification pages légales admin" ON legal_pages
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Suppression pages légales admin" ON legal_pages;
CREATE POLICY "Suppression pages légales admin" ON legal_pages
  FOR DELETE TO authenticated
  USING (is_admin());

-- Gabarit mentions légales (idempotent). Texte à compléter par le client
-- via l'admin (site santé + collecte d'e-mails via ticketing → obligatoire).
INSERT INTO legal_pages (slug, title, content)
VALUES (
  'mentions-legales',
  'Mentions légales',
  '<h2>Éditeur du site</h2><p>[À COMPLÉTER PAR LE CLIENT] Nom / raison sociale, statut juridique, adresse, e-mail de contact.</p><h2>Directeur de la publication</h2><p>[À COMPLÉTER PAR LE CLIENT] Nom du directeur de la publication.</p><h2>Hébergeur</h2><p>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — <a href="https://vercel.com">vercel.com</a>.</p><h2>Politique de confidentialité (RGPD)</h2><p>[À COMPLÉTER PAR LE CLIENT] Le formulaire de contact / signalement collecte une adresse e-mail. Préciser : finalité du traitement, base légale, durée de conservation, et modalités d''exercice des droits d''accès, de rectification et de suppression (contact du responsable de traitement).</p><h2>Propriété intellectuelle</h2><p>[À COMPLÉTER PAR LE CLIENT] Mentions relatives aux droits sur les contenus.</p><h2>Avertissement médical</h2><p>Hématoclic est un outil d''aide à la décision. Il ne se substitue pas à la responsabilité de décision et de prescription du médecin.</p>'
)
ON CONFLICT (slug) DO NOTHING;
