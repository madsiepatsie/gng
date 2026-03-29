'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Connection = {
  id: string
  from_user: string
  to_user: string
  profiles_from: { name: string; age: number; city: string; bio: string; interests: string[] }
  profiles_to: { name: string; age: number; city: string; bio: string; interests: string[] }
}

export default function Connections() {
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data } = await supabase
        .from('match_requests')
        .select(`
          *,
          profiles_from:profiles!match_requests_from_user_fkey(name, age, city, bio, interests),
          profiles_to:profiles!match_requests_to_user_fkey(name, age, city, bio, interests)
        `)
        .eq('status', 'accepted')
        .or(`from_user.eq.${user.id},to_user.eq.${user.id}`)

      setConnections(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-12 pt-20">
      <h2 className="text-3xl font-bold mb-8">Your connections</h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : connections.length === 0 ? (
        <p className="text-gray-400">No connections yet.</p>
      ) : (
        <div className="space-y-4 w-full max-w-md">
          {connections.map(c => {
            const other = c.from_user === userId ? c.profiles_to : c.profiles_from
            return (
              <div key={c.id} className="bg-gray-900 rounded-xl p-6 space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold">{other.name}, {other.age}</h3>
                  <span className="text-gray-400 text-sm">{other.city}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {other.interests?.map((i: string) => (
                    <span key={i} className="bg-gray-800 px-3 py-1 rounded-full text-xs">{i}</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm">{other.bio}</p>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}