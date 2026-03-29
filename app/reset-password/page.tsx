'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgot, setIsForgot] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handle = async () => {
    setError('')
    setMessage('')
    if (isForgot) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://gng-roan.vercel.app/reset-password'
      })
      if (error) setError(error.message)
      else setMessage('Check your email for a reset link.')
      return
    }
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/onboarding')
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full space-y-4">
        <h2 className="text-3xl font-bold">
          {isForgot ? 'Reset password' : isSignUp ? 'Create account' : 'Sign in'}
        </h2>
        <input className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        {!isForgot && (
          <input className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}
        <button onClick={handle} className="w-full bg-white text-black py-3 rounded-full font-semibold">
          {isForgot ? 'Send reset link' : isSignUp ? 'Sign up' : 'Sign in'}
        </button>
        <div className="flex justify-between text-sm text-gray-400">
          {!isForgot && (
            <span className="cursor-pointer hover:text-white" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </span>
          )}
          <span className="cursor-pointer hover:text-white" onClick={() => { setIsForgot(!isForgot); setError(''); setMessage('') }}>
            {isForgot ? 'Back to sign in' : 'Forgot password?'}
          </span>
        </div>
      </div>
    </main>
  )
}