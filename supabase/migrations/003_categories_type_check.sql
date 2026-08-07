-- =============================================
-- Migration 003 — Extension des types de catégories
--
-- La table `categories` (001) est partagée par toutes les sections
-- et discriminée par la colonne `type`. On étend la contrainte CHECK
-- pour accueillir les deux nouvelles sections introduites en 004/005 :
--   'frequentes'   → Situations Fréquentes
--   'orientations' → Orientation Diagnostique
--
-- Aucune donnée existante n'est invalidée (on n'ajoute que des valeurs
-- autorisées supplémentaires). Migration ré-exécutable.
-- =============================================

-- Retrait dynamique de la contrainte CHECK existante sur `type`
-- (nom auto-généré = categories_type_check, mais on le retrouve pour
-- rester robuste quel que soit l'environnement).
DO $$
DECLARE
  cname text;
BEGIN
  SELECT conname INTO cname
  FROM pg_constraint
  WHERE conrelid = 'public.categories'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%type%'
  LIMIT 1;

  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE categories DROP CONSTRAINT %I', cname);
  END IF;
END $$;

ALTER TABLE categories
  ADD CONSTRAINT categories_type_check
  CHECK (type IN ('fiches', 'situations', 'frequentes', 'orientations'));
