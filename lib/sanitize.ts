import 'server-only'
import sanitizeHtml from 'sanitize-html'

/**
 * Assainit du HTML riche (produit par l'éditeur Tiptap admin) avant
 * affichage public.
 *
 * Quoi : allowlist stricte de balises/attributs cohérente avec la
 *   toolbar de l'éditeur (titres, gras, listes, liens…).
 * Pourquoi : barrière anti-XSS. Le rendu public ne fait jamais confiance
 *   au HTML stocké — il est ré-assaini au moment du rendu (server-only).
 * Comment : sanitize-html (node-only) ; les liens sont forcés en
 *   rel="noopener noreferrer nofollow" et target="_blank".
 */
export function sanitizeRichText(dirty: string): string {
  if (!dirty) return ''
  return sanitizeHtml(dirty, {
    allowedTags: [
      'p', 'h2', 'h3', 'strong', 'em', 'u', 's',
      'ul', 'ol', 'li', 'a', 'blockquote', 'br', 'code', 'pre', 'hr',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        rel: 'noopener noreferrer nofollow',
        target: '_blank',
      }),
    },
  })
}

/**
 * Détermine si un contenu riche est "vide" (aucun contenu visible),
 * afin de masquer un bloc plutôt que d'afficher un cadre vide.
 *
 * La décision se base sur la SORTIE ASSAINIE (identique à ce qui est
 * réellement rendu par RichTextRenderer), pour éviter les incohérences
 * (ex: du HTML dont tout le contenu serait retiré par le sanitizer,
 * ou un séparateur <hr> visible mais sans texte).
 */
export function isRichTextEmpty(html: string | null | undefined): boolean {
  if (!html) return true
  const clean = sanitizeRichText(html)
  // Un contenu visible sans texte (ex: séparateur <hr>) n'est pas "vide".
  if (/<hr\b/i.test(clean)) return false
  const text = clean.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/g, ' ').trim()
  return text.length === 0
}
