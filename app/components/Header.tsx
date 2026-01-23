'use client'
import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 bg-[#a50000] text-white h-16 md:h-20 shadow-lg'>
        <Link className='text-xl md:text-2xl font-bold tracking-wide hover:opacity-90 transition-opacity' href={'/'}>
          Hématoclic
        </Link>

        <div className="flex-1"></div>

        <div className='flex items-center gap-3 md:gap-4'>
            <input 
              className='hidden md:block border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white transition-all w-48' 
              type="text" 
              placeholder='Rechercher...'
            />
            <Link 
              className='px-3 md:px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-sm md:text-base' 
              href={"/admin"}
            >
              Admin
            </Link>
        </div>
    </header>
  )
}

export default Header