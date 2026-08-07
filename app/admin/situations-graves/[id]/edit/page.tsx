'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getSituationGraveById } from '@/lib/db'
import { SituationGrave } from '@/lib/types/situation-grave'
import SituationForm from '../../situation-form'

export default function EditSituationGrave() {
  const { id } = useParams<{ id: string }>()
  const [initial, setInitial] = useState<SituationGrave | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSituationGraveById(id).then((data) => {
      setInitial(data)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <svg className="animate-spin w-12 h-12 text-[#a50000]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  if (!initial) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Situation introuvable</h1>
        <Link href="/admin/situations-graves" className="text-[#a50000] hover:underline">
          Retour à la liste
        </Link>
      </div>
    )
  }

  return <SituationForm mode="edit" id={id} initial={initial} />
}
