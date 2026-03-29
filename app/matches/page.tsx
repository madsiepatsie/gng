'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  name: string
  age: number
  city: string
  life_stage: string
  interests: string[]
  bio: string
}

export default function Matches() {
  const [matches, setMatches] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: me } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!me) return
      setCurrentUser(me)

      const { data: others } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)

      if (!others || others.length === 0) {
        setLoading(false)
        return
      }

      // Score matches by shared interests + life stage
      const scored = others.map((p: Profile) => {
        const sharedInterests = p.interests?.filter(i => me.interests?.includes(i)).length || 0
        const sameStage = p.life_stage === me.life_stage ? 3 : 0
        const ageDiff = Math.abs(p.age - me.age)
        const ageScore = ageDiff < 3 ? 3 : ageDiff < 7 ? 1 : 0
        return { ...p, score: sharedInterests + sameStage + ageScore }
      })

      scored.sort((a: any, b: any) => b.score - a.score)
      setMatches(scored.slice(0, 3))
      setLoading(false)
    }
    load()
  }, [])

  const connect = async (toId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('match_requests').insert({ from_user: user.id, to_user: toId })
    alert('Connection request sent!')
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Your matches</h2>
      {loading ? (
        <p className="text-gray-400">Finding your guys...</p>
      ) : matches.length === 0 ? (
        <p className="text-gray-400">No matches yet — be the first to invite friends.</p>
      ) : (
        <div className="space-y-4 w-full max-w-md">
          {matches.map(m => (
            <div key={m.id} className="bg-gray-900 rounded-xl p-6 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{m.name}, {m.age}</h3>
                <span className="text-gray-400 text-sm">{m.city}</span>
              </div>
              <p className="text-gray-400 text-sm">{m.life_stage}</p>
              <div className="flex flex-wrap gap-2">
                {m.interests?.map(i => (
                  <span key={i} className="bg-gray-800 px-3 py-1 rounded-full text-xs">{i}</span>
                ))}
              </div>
              <p className="text-gray-300 text-sm">{m.bio}</p>
              <button
                onClick={() => connect(m.id)}
                className="w-full bg-white text-black py-2 rounded-full font-semibold mt-2"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}