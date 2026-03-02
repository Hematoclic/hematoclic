'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchModal from './SearchModal'

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Raccourci clavier Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className='sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 bg-[#a50000] text-white h-16 md:h-20 shadow-lg'>
        <Link className='text-xl md:text-2xl font-bold tracking-wide hover:opacity-90 transition-opacity' href={'/'}>
          Hématoclic
        </Link>

        <div className="flex-1"></div>

        <div className='flex items-center gap-3 md:gap-4'>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className='hidden md:flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-sm text-white/80 px-4 py-2 rounded-full hover:bg-white/20 transition-all w-56'
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="flex-1 text-left text-sm">Rechercher...</span>
              <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">⌘K</kbd>
            </button>
            {/* Bouton mobile */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className='md:hidden p-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors'
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link 
              className='px-3 md:px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-sm md:text-base' 
              href={"/admin"}
            >
              Admin
            </Link>
        </div>
      </header>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  )
}

export default Header