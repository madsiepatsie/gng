'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Request = {
  id: string
  from_user: string
  status: string
  profiles: {
    name: string
    age: number
    city: string
  }
}

export default function Messages() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('match_requests')
        .select('*, profiles!match_requests_from_user_fkey(name, age, city)')
        .eq('to_user', user.id)
        .eq('status', 'pending')

      setRequests(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const respond = async (id: string, status: 'accepted' | 'declined') => {
    await supabase.from('match_requests').update({ status }).eq('id', id)
    setRequests(r => r.filter(x => x.id !== id))
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-12 pt-20">
      <h2 className="text-3xl font-bold mb-8">Connection requests</h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-400">No pending requests.</p>
      ) : (
        <div className="space-y-4 w-full max-w-md">
          {requests.map(r => (
            <div key={r.id} className="bg-gray-900 rounded-xl p-6 space-y-3">
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold">{r.profiles.name}, {r.profiles.age}</h3>
                <span className="text-gray-400 text-sm">{r.profiles.city}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => respond(r.id, 'accepted')} className="flex-1 bg-white text-black py-2 rounded-full font-semibold">Accept</button>
                <button onClick={() => respond(r.id, 'declined')} className="flex-1 border border-gray-700 text-white py-2 rounded-full">Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}