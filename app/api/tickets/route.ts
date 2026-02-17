import { NextRequest, NextResponse } from 'next/server'
import { createTicket } from '@/lib/db'

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

    const result = await createTicket(email, sujet, message)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erreur lors de la création du ticket' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, ticket: result.ticket })
  } catch (error) {
    console.error('Erreur API ticket:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
