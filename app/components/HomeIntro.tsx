import { getSiteSetting } from '@/lib/db'
import { isRichTextEmpty } from '@/lib/sanitize'
import RichTextRenderer from './rich-text/RichTextRenderer'

/**
 * Encart éditorial de la page d'accueil.
 *
 * Quoi : Server Component affichant le contenu riche 'home-intro'
 *   (remerciements, sources, disclaimer…) dans un bloc pointillé.
 * Pourquoi : contenu éditable en admin, sans redéploiement.
 * Comment : lit site_settings via le DMS ; si le contenu est vide,
 *   ne rend RIEN (pas de cadre vide).
 */
export default async function HomeIntro() {
  const setting = await getSiteSetting('home-intro')
  if (!setting || isRichTextEmpty(setting.value)) {
    return null
  }

  return (
    <section className="max-w-4xl mx-auto mb-14 md:mb-16">
      <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 md:p-8">
        <RichTextRenderer content={setting.value} />
      </div>
    </section>
  )
}
