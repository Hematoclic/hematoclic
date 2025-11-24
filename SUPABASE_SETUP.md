# Configuration Supabase

## Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=https://iyllteozniqgxoedkqha.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

## Obtenir votre clé API

1. Allez sur votre dashboard Supabase : https://supabase.com/dashboard/project/iyllteozniqgxoedkqha
2. Naviguez vers **Settings** > **API**
3. Copiez la **anon/public** key
4. Collez-la dans votre fichier `.env.local`

## Utilisation

Le client Supabase est disponible via `lib/supabase.ts` :

```typescript
import { supabase } from '@/lib/supabase'

// Exemple : lire des données
const { data, error } = await supabase
  .from('table_name')
  .select('*')
```

## Test de connexion

Pour tester la connexion, utilisez la fonction `testSupabaseConnection()` :

```typescript
import { testSupabaseConnection } from '@/lib/supabase'

const result = await testSupabaseConnection()
console.log(result)
```

