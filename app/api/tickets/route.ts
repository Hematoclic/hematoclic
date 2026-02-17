import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, sujet, message } = body

    // Validation
    if (!email || !sujet || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Vérifier que le client admin est disponible
    if (!supabaseAdmin) {
      console.error('SUPABASE_SERVICE_ROLE_KEY non configurée')
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      )
    }

    // Utiliser le client admin pour bypass RLS
    const { data, error } = await supabaseAdmin
      .from('tickets')
      .insert({ email, sujet, message })
      .select()
      .single()

    if (error) {
      console.error('Erreur création ticket:', error)
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la création du ticket' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, ticket: data })
  } catch (error) {
    console.error('Erreur API ticket:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
