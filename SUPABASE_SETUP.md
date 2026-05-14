# Configuration Supabase

## Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=https://<votre-projet>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre_anon_key>
# UNIQUEMENT côté serveur (jamais préfixée NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=<votre_service_role_key>
```

> ⚠️ Ne committez jamais `.env.local`. La clé `service_role` bypass toutes les RLS — elle ne doit JAMAIS être exposée côté client.

## Obtenir vos clés

1. Allez sur votre dashboard Supabase et sélectionnez le projet.
2. Naviguez vers **Settings** > **API**.
3. Copiez la **anon/public** key dans `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copiez la **service_role** key dans `SUPABASE_SERVICE_ROLE_KEY` (jamais préfixée `NEXT_PUBLIC_`).

## Utilisation

Client navigateur (RLS appliquée) :

```typescript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase.from('table_name').select('*')
```

Client serveur (bypass RLS, à utiliser dans les routes API uniquement) :

```typescript
import { getSupabaseAdmin } from '@/lib/supabase-server'

const admin = getSupabaseAdmin()
const { data, error } = await admin.from('table_name').insert(...)
```

## Test de connexion

```typescript
import { testSupabaseConnection } from '@/lib/supabase'

const result = await testSupabaseConnection()
console.log(result)
```
