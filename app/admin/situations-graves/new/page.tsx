'use client'
import { useSearchParams } from 'next/navigation'
import SituationForm from '../situation-form'

export default function NewSituationGrave() {
  const searchParams = useSearchParams()
  const categorie = searchParams.get('categorie') || ''
  return <SituationForm mode="create" initialCategorie={categorie} />
}
