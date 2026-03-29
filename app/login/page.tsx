'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handle = async () => {
    setError('')
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/onboarding')
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full space-y-4">
        <h2 className="text-3xl font-bold">{isSignUp ? 'Create account' : 'Sign in'}</h2>
        <input className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button onClick={handle} className="w-full bg-white text-black py-3 rounded-full font-semibold">
          {isSignUp ? 'Sign up' : 'Sign in'}
        </button>
        <p className="text-gray-400 text-sm text-center cursor-pointer" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </p>
      </div>
    </main>
  )
}