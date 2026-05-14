'use client'
import React, { useState, useEffect } from 'react'
import { Ticket, getTickets, deleteTicket } from '@/lib/db'

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    setLoading(true)
    const data = await getTickets()
    setTickets(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      return
    }

    setDeleting(id)
    const result = await deleteTicket(id)
    
    if (result.success) {
      setTickets(tickets.filter(t => t.id !== id))
      if (selectedTicket?.id === id) {
        setSelectedTicket(null)
      }
    } else {
      alert(`Erreur: ${result.error}`)
    }
    setDeleting(null)
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'nouveau':
        return 'bg-blue-100 text-blue-700'
      case 'lu':
        return 'bg-yellow-100 text-yellow-700'
      case 'resolu':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 mx-auto text-[#a50000] mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500">Chargement des tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600 mt-1">
            {tickets.length} ticket{tickets.length > 1 ? 's' : ''} reçu{tickets.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={loadTickets}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Actualiser</span>
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Aucun ticket</h3>
          <p className="text-gray-500 mt-1">Les tickets des utilisateurs apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste des tickets */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Liste des tickets</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedTicket?.id === ticket.id ? 'bg-[#a50000]/5 border-l-4 border-[#a50000]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(ticket.statut)}`}>
                          {ticket.statut}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(ticket.createdAt)}</span>
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">{ticket.sujet}</h3>
                      <p className="text-sm text-gray-500 truncate">{ticket.email}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(ticket.id)
                      }}
                      disabled={deleting === ticket.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      {deleting === ticket.id ? (
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Détail du ticket */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Détail du ticket</h2>
            </div>
            {selectedTicket ? (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(selectedTicket.statut)}`}>
                    {selectedTicket.statut}
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(selectedTicket.createdAt)}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedTicket.sujet}</h3>
                
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${selectedTicket.email}`} className="text-[#a50000] hover:underline">
                    {selectedTicket.email}
                  </a>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Message</h4>
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>

                <div className="mt-6 flex gap-2">
                  <a
                    href={`mailto:${selectedTicket.email}?subject=Re: ${selectedTicket.sujet}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#a50000] text-white rounded-lg hover:bg-[#8a0000] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Répondre par email</span>
                  </a>
                  <button
                    onClick={() => handleDelete(selectedTicket.id)}
                    disabled={deleting === selectedTicket.id}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p>Sélectionnez un ticket pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
