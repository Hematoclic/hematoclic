'use client'
import React, { useState } from 'react'
import { supabase, testSupabaseConnection } from '@/lib/supabase'

const Test = () => {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleTestConnection = async () => {
    setLoading(true)
    setStatus('Test en cours...')
    
    try {
      const result = await testSupabaseConnection()
      if (result.success) {
        setStatus('✅ Connexion réussie !')
      } else {
        setStatus(`❌ Erreur : ${result.error}`)
      }
    } catch (error: any) {
      setStatus(`❌ Erreur : ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Supabase</h2>
      <button 
        onClick={handleTestConnection}
        disabled={loading}
        className="px-4 py-2 bg-[#a50000] text-white rounded-lg hover:bg-[#8c0000] disabled:opacity-50"
      >
        {loading ? 'Test en cours...' : 'Tester la connexion'}
      </button>
      {status && (
        <p className="mt-4 text-sm">{status}</p>
      )}
      <div className="mt-4 text-xs text-gray-500">
        <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Non configuré'}</p>
        <p>Clé API: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurée' : '❌ Manquante'}</p>
      </div>
    </div>
  )
}

export default Test