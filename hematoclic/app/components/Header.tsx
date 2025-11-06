'use client'
import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='flex items-center justify-between p-2 px-8 bg-[#a50000] text-neutral-50 h-20'>
        <Link className='text-2xl font-bold tracking-wide' href={'/'}>Hématoclic</Link>

        <div className="flex-1"></div>

        <div className='flex items-center gap-4'>
            <input className='border border-white p-2 pl-4 rounded-full focus:outline-none focus:ring-0 -400 ring-0' type="text" placeholder='rechercher...'/>
            <Link className='p-2 border border-[#a50000] rounded-md hover:bg-[#8c0000]' href={"/admin"}>Admin</Link>
        </div>
    </header>
  )
}

export default Header