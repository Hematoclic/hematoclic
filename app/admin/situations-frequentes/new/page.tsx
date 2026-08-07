'use client'
import { useSearchParams } from 'next/navigation'
import FrequenteForm from '../frequente-form'

export default function NewSituationFrequente() {
  const searchParams = useSearchParams()
  const categorie = searchParams.get('categorie') || ''
  return <FrequenteForm mode="create" initialCategorie={categorie} />
}
