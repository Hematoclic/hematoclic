-- =============================================
-- Migration 002 — Restriction des écritures aux admins
--
-- Ajoute une table admin_users et reserre les policies RLS
-- pour que seuls les utilisateurs présents dans admin_users
-- puissent créer/modifier/supprimer des fiches, situations
-- et catégories. Les lectures publiques restent ouvertes.
-- =============================================

CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Un utilisateur peut vérifier s'il est admin (lecture de sa propre ligne).
DROP POLICY IF EXISTS "Lecture admin_users self" ON admin_users;
CREATE POLICY "Lecture admin_users self" ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Aucune policy INSERT/UPDATE/DELETE → seul le service_role
-- (côté serveur) peut gérer les admins.

-- Helper SQL : vérifie si l'utilisateur courant est admin.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;

-- =============================================
-- categories : écritures admin uniquement
-- =============================================
DROP POLICY IF EXISTS "Création catégories" ON categories;
DROP POLICY IF EXISTS "Modification catégories" ON categories;
DROP POLICY IF EXISTS "Suppression catégories" ON categories;

CREATE POLICY "Création catégories admin" ON categories
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Modification catégories admin" ON categories
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Suppression catégories admin" ON categories
  FOR DELETE TO authenticated
  USING (is_admin());

-- =============================================
-- fiches_pathologiques : écritures admin uniquement
-- =============================================
DROP POLICY IF EXISTS "Création fiches" ON fiches_pathologiques;
DROP POLICY IF EXISTS "Modification fiches" ON fiches_pathologiques;
DROP POLICY IF EXISTS "Suppression fiches" ON fiches_pathologiques;

CREATE POLICY "Création fiches admin" ON fiches_pathologiques
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Modification fiches admin" ON fiches_pathologiques
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Suppression fiches admin" ON fiches_pathologiques
  FOR DELETE TO authenticated
  USING (is_admin());

-- =============================================
-- situations_graves : écritures admin uniquement
-- =============================================
DROP POLICY IF EXISTS "Création situations" ON situations_graves;
DROP POLICY IF EXISTS "Modification situations" ON situations_graves;
DROP POLICY IF EXISTS "Suppression situations" ON situations_graves;

CREATE POLICY "Création situations admin" ON situations_graves
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Modification situations admin" ON situations_graves
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Suppression situations admin" ON situations_graves
  FOR DELETE TO authenticated
  USING (is_admin());

-- =============================================
-- tickets : lecture/modification/suppression admin uniquement
-- (les utilisateurs anonymes gardent le droit de CRÉER un ticket
-- — policy existante "Création tickets pour tous" conservée).
-- =============================================
DROP POLICY IF EXISTS "Lecture tickets admin" ON tickets;
DROP POLICY IF EXISTS "Modification tickets admin" ON tickets;
DROP POLICY IF EXISTS "Suppression tickets admin" ON tickets;

CREATE POLICY "Lecture tickets admin" ON tickets
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Modification tickets admin" ON tickets
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Suppression tickets admin" ON tickets
  FOR DELETE TO authenticated
  USING (is_admin());

-- =============================================
-- Pour ajouter un admin (à exécuter manuellement avec le service_role) :
--
--   INSERT INTO admin_users (user_id)
--   VALUES ('<uuid-de-l-utilisateur-auth>');
--
-- L'UUID se trouve dans Authentication > Users du dashboard Supabase.
-- =============================================
