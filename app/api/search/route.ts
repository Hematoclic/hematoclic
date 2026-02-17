import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')?.toLowerCase() || ''

  if (query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    // Rechercher dans les fiches pathologiques
    const { data: fiches, error: fichesError } = await supabase
      .from('fiches_pathologiques')
      .select('id, categorie, informations_generales')

    if (fichesError) throw fichesError

    // Rechercher dans les situations graves
    const { data: situations, error: situationsError } = await supabase
      .from('situations_graves')
      .select('id, nom, categorie, description, niveau_urgence')

    if (situationsError) throw situationsError

    // Filtrer et formater les résultats des fiches
    const fichesResults = (fiches || [])
      .filter(fiche => {
        const nom = fiche.informations_generales?.nom?.toLowerCase() || ''
        const definition = fiche.informations_generales?.definition?.toLowerCase() || ''
        const categorie = fiche.categorie?.toLowerCase() || ''
        return nom.includes(query) || definition.includes(query) || categorie.includes(query)
      })
      .map(fiche => ({
        id: fiche.id,
        type: 'fiche' as const,
        nom: fiche.informations_generales?.nom || 'Sans nom',
        categorie: fiche.categorie,
        description: fiche.informations_generales?.definition || '',
      }))

    // Filtrer et formater les résultats des situations
    const situationsResults = (situations || [])
      .filter(situation => {
        const nom = situation.nom?.toLowerCase() || ''
        const description = situation.description?.toLowerCase() || ''
        const categorie = situation.categorie?.toLowerCase() || ''
        return nom.includes(query) || description.includes(query) || categorie.includes(query)
      })
      .map(situation => ({
        id: situation.id,
        type: 'situation' as const,
        nom: situation.nom,
        categorie: situation.categorie,
        description: situation.description || '',
        badge: {
          text: situation.niveau_urgence?.toUpperCase() || 'GRAVE',
          color: getUrgenceBadgeColor(situation.niveau_urgence),
        }
      }))

    // Combiner et trier par pertinence (nom exact en premier)
    const allResults = [...fichesResults, ...situationsResults].sort((a, b) => {
      const aNameMatch = a.nom.toLowerCase().startsWith(query) ? 0 : 1
      const bNameMatch = b.nom.toLowerCase().startsWith(query) ? 0 : 1
      return aNameMatch - bNameMatch
    })

    return NextResponse.json({ results: allResults.slice(0, 20) })
  } catch (error) {
    console.error('Erreur de recherche:', error)
    return NextResponse.json({ results: [], error: 'Erreur de recherche' }, { status: 500 })
  }
}

function getUrgenceBadgeColor(niveau: string) {
  switch (niveau) {
    case 'critique': return 'bg-red-100 text-red-700'
    case 'urgent': return 'bg-orange-100 text-orange-700'
    case 'grave': return 'bg-yellow-100 text-yellow-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
