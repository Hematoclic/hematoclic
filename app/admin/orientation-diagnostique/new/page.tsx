'use client'
import { useSearchParams } from 'next/navigation'
import OrientationForm from '../orientation-form'

export default function NewOrientationDiagnostique() {
  const searchParams = useSearchParams()
  const categorie = searchParams.get('categorie') || ''
  return <OrientationForm mode="create" initialCategorie={categorie} />
}
