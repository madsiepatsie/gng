'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MatchOfTheDay() {
  const [match, setMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [responded, setResponded] = useState(false)
  const [existingResponse, setExistingResponse] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const today = new Date().toISOString().split('T')[0]

      // Check if already matched today
      const { data: existing } = await supabase
        .from('daily_matches')
        .select('*, profiles!daily_matches_matched_with_fkey(*)')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (existing) {
        setMatch(existing.profiles)
        setExistingResponse(existing.response)
        setLoading(false)
        return
      }

      // Get current user profile
      const { data: me } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!me) { router.push('/onboarding'); return }

      // Get all other profiles
      const { data: others } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)

      if (!others || others.length === 0) {
        setLoading(false)
        return
      }

      // Score by shared interests + life stage + age
      const scored = others.map((p: any) => {
        const shared = p.interests?.filter((i: string) => me.interests?.includes(i)).length || 0
        const stage = p.life_stage === me.life_stage ? 3 : 0
        const age = Math.abs(p.age - me.age) < 3 ? 3 : Math.abs(p.age - me.age) < 7 ? 1 : 0
        return { ...p, score: shared + stage + age }
      })
      scored.sort((a: any, b: any) => b.score - a.score)
      const best = scored[0]

      // Save daily match
      await supabase.from('daily_matches').insert({
        user_id: user.id,
        matched_with: best.id,
        date: today
      })

      setMatch(best)
      setLoading(false)
    }
    load()
  }, [])

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
    setResponded(true)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Your match today</p>
          <h1 className="text-4xl font-bold">GNG</h1>
        </div>

        {loading ? (
          <p className="text-gray-400">Finding your match...</p>
        ) : !match ? (
          <p className="text-gray-400">No matches available yet. Check back soon.</p>
        ) : responded || existingResponse ? (
          <div className="bg-gray-900 rounded-2xl p-8 space-y-2">
            <p className="text-gray-400 text-sm">You said <span className={existingResponse === 'yes' ? 'text-green-400' : 'text-red-400'}>{existingResponse}</span> to</p>
            <h2 className="text-2xl font-bold">{match.name}, {match.age}</h2>
            <p className="text-gray-400">{match.city} · {match.life_stage}</p>
            <p className="text-gray-300 text-sm mt-2">{existingResponse === 'yes' ? "If they say yes too, you'll both be connected." : "Come back tomorrow for a new match."}</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold mx-auto">
              {match.name?.[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{match.name}, {match.age}</h2>
              <p className="text-gray-400">{match.city} · {match.life_stage}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {match.interests?.map((i: string) => (
                <span key={i} className="bg-gray-800 px-3 py-1 rounded-full text-xs">{i}</span>
              ))}
            </div>
            <p className="text-gray-300 text-sm">{match.bio}</p>
            <div className="flex gap-4 pt-2">
              <button onClick={() => respond('no')} className="flex-1 border border-gray-700 text-white py-3 rounded-full text-lg hover:border-red-500 hover:text-red-400 transition">✕</button>
              <button onClick={() => respond('yes')} className="flex-1 bg-white text-black py-3 rounded-full text-lg font-semibold hover:bg-green-400 transition">✓</button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}