'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleLogin = async () => {
    await supabase.auth.signInWithOtp({ email })
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-4">
        <h2 className="text-3xl font-bold">Sign in</h2>
        {sent ? (
          <p className="text-gray-400">Check your email for a magic link.</p>
        ) : (
          <>
            <input
              className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-white text-black py-3 rounded-full font-semibold"
            >
              Send magic link
            </button>
          </>
        )}
      </div>
    </main>
  )
}