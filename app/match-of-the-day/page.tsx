'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MatchOfTheDay() {
  const [match, setMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [existingResponse, setExistingResponse] = useState<string | null>(null)
  const [reason, setReason] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const today = new Date().toISOString().split('T')[0]

      const { data: existing } = await supabase
        .from('daily_matches')
        .select('*, profiles!daily_matches_matched_with_fkey(*)')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      const { data: myProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (existing) {
        setMatch(existing.profiles)
        setExistingResponse(existing.response)
        setLoading(false)
        fetchReason(myProfile, existing.profiles)
        return
      }

      if (!myProfile) { router.push('/onboarding'); return }

      const { data: others } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)

      if (!others || others.length === 0) {
        setLoading(false)
        return
      }

      const scored = others.map((p: any) => {
        const shared = p.interests?.filter((i: string) => myProfile.interests?.includes(i)).length || 0
        const stage = p.life_stage === myProfile.life_stage ? 3 : 0
        const age = Math.abs(p.age - myProfile.age) < 3 ? 3 : Math.abs(p.age - myProfile.age) < 7 ? 1 : 0
        return { ...p, score: shared + stage + age }
      })
      scored.sort((a: any, b: any) => b.score - a.score)
      const best = scored[0]

      await supabase.from('daily_matches').insert({
        user_id: user.id,
        matched_with: best.id,
        date: today
      })

      setMatch(best)
      setLoading(false)
      fetchReason(myProfile, best)
    }
    load()
  }, [])

  const fetchReason = async (myProfile: any, matchProfile: any) => {
    try {
      const res = await fetch('/api/match-reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ me: myProfile, match: matchProfile })
      })
      const data = await res.json()
      setReason(data.reason)
    } catch {
      setReason('')
    }
  }

  const respond = async (response: 'yes' | 'no') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    await supabase
      .from('daily_matches')
      .update({ response })
      .eq('user_id', user.id)
      .eq('date', today)
    setExistingResponse(response)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center px-4 pt-24"
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600 mb-1">Your match today</p>
          <p className="text-xs text-gray-700">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 text-sm">Finding your match...</div>
        ) : !match ? (
          <div className="text-center text-gray-600 text-sm">No matches available yet.</div>
        ) : existingResponse ? (
          <div className="border border-gray-800 rounded-2xl p-8 text-center space-y-3 bg-[#111] float">
            <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold mx-auto">
              {match.name?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-xl font-bold">{match.name}, {match.age}</h2>
            <p className="text-gray-500 text-sm">{match.city} · {match.life_stage}</p>
            <p className={`text-sm font-medium ${existingResponse === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
              {existingResponse === 'yes' ? '✓ You said yes' : '✕ You passed'}
            </p>
            {reason && <p className="text-gray-500 text-xs italic border-t border-gray-800 pt-3">"{reason}"</p>}
            <p className="text-gray-600 text-xs pt-1">
              {existingResponse === 'yes' ? "If they say yes too, you'll be connected. Check back tomorrow." : "Come back tomorrow for a new match."}
            </p>
          </div>
        ) : (
          <div className="border border-gray-800 rounded-2xl overflow-hidden bg-[#111]">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold mx-auto border border-gray-700">
                {match.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{match.name}, {match.age}</h2>
                <p className="text-gray-500 text-sm mt-1">{match.city} · {match.life_stage}</p>
              </div>
              {reason && (
                <p className="text-gray-400 text-sm italic">"{reason}"</p>
              )}
              <div className="flex flex-wrap gap-2 justify-center">
                {match.interests?.map((i: string) => (
                  <span key={i} className="bg-gray-900 border border-gray-800 px-3 py-1 rounded-full text-xs text-gray-400">{i}</span>
                ))}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{match.bio}</p>
            </div>
            <div className="grid grid-cols-2 border-t border-gray-800">
              <button
                onClick={() => respond('no')}
                className="py-4 text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all text-lg border-r border-gray-800"
              >
                ✕
              </button>
              <button
                onClick={() => respond('yes')}
                className="py-4 text-gray-400 hover:text-green-400 hover:bg-green-400/5 transition-all text-lg font-semibold"
              >
                ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}