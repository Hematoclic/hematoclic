import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const MAX_EMAIL_LENGTH = 255
const MAX_SUJET_LENGTH = 255
const MAX_MESSAGE_LENGTH = 10000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5

export async function POST(request: NextRequest) {
  const limit = rateLimit(`tickets:${getClientIp(request)}`, {
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
  })
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      },
    )
  }

  try {
    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const sujet = typeof body?.sujet === 'string' ? body.sujet.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!email || !sujet || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    if (
      email.length > MAX_EMAIL_LENGTH ||
      sujet.length > MAX_SUJET_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { error: 'Un des champs dépasse la taille maximale autorisée' },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    let admin
    try {
      admin = getSupabaseAdmin()
    } catch (err) {
      console.error('Erreur configuration serveur:', err)
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      )
    }

    const { data, error } = await admin
      .from('tickets')
      .insert({ email, sujet, message })
      .select()
      .single()

    if (error) {
      console.error('Erreur création ticket:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création du ticket' },
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
