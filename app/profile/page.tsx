'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const INTERESTS = ['fitness', 'gaming', 'music', 'cooking', 'travel', 'business', 'tech', 'sports', 'art', 'reading']
const LIFE_STAGES = ['student', 'early career', 'building a business', 'settled & working', 'new parent']

export default function Profile() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', age: '', city: '', life_stage: '', interests: [] as string[], bio: ''
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) setForm({ ...data, age: String(data.age) })
    }
    load()
  }, [])

  const toggleInterest = (i: string) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i]
    }))
  }

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').upsert({ id: user.id, ...form, age: parseInt(form.age) })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-12 pt-20">
      <div className="max-w-md w-full space-y-4">
        <h2 className="text-3xl font-bold mb-4">Your profile</h2>
        <input className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white" placeholder="Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
        <input className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white" placeholder="Age" type="number" value={form.age} onChange={e => setForm(f => ({...f, age: e.target.value}))} />
        <input className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white" placeholder="City" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} />
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">Life stage</p>
          {LIFE_STAGES.map(s => (
            <button key={s} onClick={() => setForm(f => ({...f, life_stage: s}))} className={`w-full py-3 rounded-lg border ${form.life_stage === s ? 'bg-white text-black' : 'border-gray-700 text-white'}`}>{s}</button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">Interests</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => (
              <button key={i} onClick={() => toggleInterest(i)} className={`px-4 py-2 rounded-full border ${form.interests.includes(i) ? 'bg-white text-black' : 'border-gray-700 text-white'}`}>{i}</button>
            ))}
          </div>
        </div>
        <textarea className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white h-32" placeholder="Bio" value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))} />
        <button onClick={save} className="w-full bg-white text-black py-3 rounded-full font-semibold">
          {saved ? 'Saved!' : 'Save profile'}
        </button>
      </div>
    </main>
  )
}