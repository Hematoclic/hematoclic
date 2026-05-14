'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getFichesPathologiques, getSituationsGraves } from '@/lib/db'

export default function AdminDashboard() {
  const [fichesCount, setFichesCount] = useState<number | null>(null)
  const [situationsCount, setSituationsCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const [fiches, situations] = await Promise.all([
        getFichesPathologiques(),
        getSituationsGraves(),
      ])
      setFichesCount(fiches.length)
      setSituationsCount(situations.length)
      setLoading(false)
    }
    loadStats()
  }, [])

  const stats = [
    {
      name: 'Fiches Pathologies',
      value: loading ? '...' : fichesCount?.toString() || '0',
      description: 'fiches créées',
      href: '/admin/fiches-pathologies',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      name: 'Situations Graves',
      value: loading ? '...' : situationsCount?.toString() || '0',
      description: 'situations documentées',
      href: '/admin/situations-graves',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'bg-red-500',
    },
  ]

  const quickActions = [
    {
      name: 'Nouvelle Fiche Pathologie',
      href: '/admin/fiches-pathologies/new',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      name: 'Nouvelle Situation Grave',
      href: '/admin/situations-graves/new',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenue dans l&apos;administration d&apos;Hématoclic</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#a50000] text-white rounded-lg hover:bg-[#8a0000] transition-colors"
            >
              {action.icon}
              <span>{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité récente</h2>
        <div className="text-gray-500 text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Aucune activité récente</p>
        </div>
      </div>
    </div>
  )
}
