import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const MIN_QUERY_LENGTH = 2
const MAX_QUERY_LENGTH = 100
const MAX_RESULTS = 20
const FETCH_LIMIT = 500

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get('q') ?? ''
  const trimmed = rawQuery.trim().slice(0, MAX_QUERY_LENGTH)
  const query = trimmed.toLowerCase()

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ results: [] })
  }

  try {
    const [fichesRes, situationsRes] = await Promise.all([
      supabase
        .from('fiches_pathologiques')
        .select('id, categorie, informations_generales')
        .limit(FETCH_LIMIT),
      supabase
        .from('situations_graves')
        .select('id, nom, categorie, description, niveau_urgence')
        .limit(FETCH_LIMIT),
    ])

    if (fichesRes.error) throw fichesRes.error
    if (situationsRes.error) throw situationsRes.error

    const fichesResults = (fichesRes.data || [])
      .filter((fiche) => {
        const nom = fiche.informations_generales?.nom?.toLowerCase() || ''
        const definition = fiche.informations_generales?.definition?.toLowerCase() || ''
        const categorie = fiche.categorie?.toLowerCase() || ''
        return nom.includes(query) || definition.includes(query) || categorie.includes(query)
      })
      .map((fiche) => ({
        id: fiche.id,
        type: 'fiche' as const,
        nom: fiche.informations_generales?.nom || 'Sans nom',
        categorie: fiche.categorie,
        description: fiche.informations_generales?.definition || '',
      }))

    const situationsResults = (situationsRes.data || [])
      .filter((situation) => {
        const nom = situation.nom?.toLowerCase() || ''
        const description = situation.description?.toLowerCase() || ''
        const categorie = situation.categorie?.toLowerCase() || ''
        return nom.includes(query) || description.includes(query) || categorie.includes(query)
      })
      .map((situation) => ({
        id: situation.id,
        type: 'situation' as const,
        nom: situation.nom,
        categorie: situation.categorie,
        description: situation.description || '',
        badge: {
          text: situation.niveau_urgence?.toUpperCase() || 'GRAVE',
          color: getUrgenceBadgeColor(situation.niveau_urgence),
        },
      }))

    const allResults = [...fichesResults, ...situationsResults].sort((a, b) => {
      const aNameMatch = a.nom.toLowerCase().startsWith(query) ? 0 : 1
      const bNameMatch = b.nom.toLowerCase().startsWith(query) ? 0 : 1
      return aNameMatch - bNameMatch
    })

    return NextResponse.json({ results: allResults.slice(0, MAX_RESULTS) })
  } catch (error) {
    console.error('Erreur de recherche:', error)
    return NextResponse.json(
      { results: [], error: 'Erreur de recherche' },
      { status: 500 },
    )
  }
}

function getUrgenceBadgeColor(niveau: string) {
  switch (niveau) {
    case 'critique':
      return 'bg-red-100 text-red-700'
    case 'urgent':
      return 'bg-orange-100 text-orange-700'
    case 'grave':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}
