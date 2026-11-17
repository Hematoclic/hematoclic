'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  countFichesPathologiques,
  countSituationsGraves,
  countSituationsFrequentes,
  countOrientationsDiagnostiques,
} from '@/lib/db'

export default function AdminDashboard() {
  const [fichesCount, setFichesCount] = useState<number | null>(null)
  const [situationsCount, setSituationsCount] = useState<number | null>(null)
  const [frequentesCount, setFrequentesCount] = useState<number | null>(null)
  const [orientationsCount, setOrientationsCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const [fiches, situations, frequentes, orientations] = await Promise.all([
        countFichesPathologiques(),
        countSituationsGraves(),
        countSituationsFrequentes(),
        countOrientationsDiagnostiques(),
      ])
      setFichesCount(fiches)
      setSituationsCount(situations)
      setFrequentesCount(frequentes)
      setOrientationsCount(orientations)
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
    {
      name: 'Situations Fréquentes',
      value: loading ? '...' : frequentesCount?.toString() || '0',
      description: 'situations courantes',
      href: '/admin/situations-frequentes',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'bg-pink-500',
    },
    {
      name: 'Orientation Diagnostique',
      value: loading ? '...' : orientationsCount?.toString() || '0',
      description: 'démarches documentées',
      href: '/admin/orientation-diagnostique',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'bg-amber-500',
    },
  ]

  const quickActions = [
    { name: 'Nouvelle Fiche Pathologie', href: '/admin/fiches-pathologies/new' },
    { name: 'Nouvelle Situation Grave', href: '/admin/situations-graves/new' },
    { name: 'Nouvelle Situation Fréquente', href: '/admin/situations-frequentes/new' },
    { name: 'Nouvelle Orientation', href: '/admin/orientation-diagnostique/new' },
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Contenus du site */}
      <div className="mt-8">
        <Link
          href="/admin/contenus"
          className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-700 text-white p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">Contenus du site</p>
              <p className="text-sm text-gray-500">Encart d&apos;accueil et mentions légales</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
