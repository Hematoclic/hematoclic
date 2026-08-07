import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RichTextRenderer from '../components/rich-text/RichTextRenderer'
import { getLegalPageBySlug } from '@/lib/db'
import { isRichTextEmpty } from '@/lib/sanitize'

export const metadata: Metadata = {
  title: 'Mentions légales | Hématoclic',
  description: 'Mentions légales et politique de confidentialité d\'Hématoclic.',
}

// Contenu éditable en admin — pas de cache statique.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MentionsLegales() {
  const page = await getLegalPageBySlug('mentions-legales')
  const title = page?.title || 'Mentions légales'
  const hasContent = page && !isRichTextEmpty(page.content)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-[#a50000] transition-colors mb-8"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l&apos;accueil
          </Link>

          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">{title}</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
              {hasContent ? (
                <RichTextRenderer content={page.content} />
              ) : (
                <p className="text-gray-500">
                  Le contenu des mentions légales sera prochainement disponible.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
