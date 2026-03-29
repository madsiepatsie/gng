'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="fixed top-0 w-full bg-black border-b border-gray-800 px-6 py-3 flex justify-between items-center z-50">
        <Link href="/" className="font-bold text-white text-lg">GNG</Link>
        <Link href="/messages" className="text-gray-400 text-sm hover:text-white">Requests</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-semibold">
              {user.email?.[0].toUpperCase()}
            </div>
            <button onClick={signOut} className="text-gray-400 text-sm hover:text-white">Sign out</button>
          </>
        ) : (
          <Link href="/login" className="text-white text-sm bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700">Sign in</Link>
        )}
      </div>
    </nav>
  )
}