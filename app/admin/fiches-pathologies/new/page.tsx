'use client'
import { useSearchParams } from 'next/navigation'
import FicheForm from '../fiche-form'

export default function NewFichePathologie() {
  const searchParams = useSearchParams()
  const categorie = searchParams.get('categorie') || ''
  return <FicheForm mode="create" initialCategorie={categorie} />
}
