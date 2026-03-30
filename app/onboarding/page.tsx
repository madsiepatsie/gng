'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const INTERESTS = ['fitness', 'gaming', 'music', 'cooking', 'travel', 'business', 'tech', 'sports', 'art', 'reading']
const LIFE_STAGES = ['student', 'early career', 'building a business', 'settled & working', 'new parent']

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    age: '',
    city: '',
    life_stage: '',
    interests: [] as string[],
    bio: ''
  })

  const toggleInterest = (i: string) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i)
        ? f.interests.filter(x => x !== i)
        : [...f.interests, i]
    }))
  }

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    await supabase.from('profiles').upsert({
      id: user.id,
      ...form,
      age: parseInt(form.age)
    })
    router.push('/match-of-the-day')
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Who are you?</h2>
            <input className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            <input className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white" placeholder="Age" type="number" value={form.age} onChange={e => setForm(f => ({...f, age: e.target.value}))} />
            <input className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white" placeholder="City" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} />
            <button onClick={() => setStep(2)} className="w-full bg-white text-black py-3 rounded-full font-semibold">Next</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Where are you in life?</h2>
            {LIFE_STAGES.map(s => (
              <button key={s} onClick={() => setForm(f => ({...f, life_stage: s}))} className={`w-full py-3 rounded-lg border ${form.life_stage === s ? 'bg-white text-black' : 'border-gray-700 text-white'}`}>{s}</button>
            ))}
            <button onClick={() => setStep(3)} className="w-full bg-white text-black py-3 rounded-full font-semibold mt-4">Next</button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">What are you into?</h2>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(i => (
                <button key={i} onClick={() => toggleInterest(i)} className={`px-4 py-2 rounded-full border ${form.interests.includes(i) ? 'bg-white text-black' : 'border-gray-700 text-white'}`}>{i}</button>
              ))}
            </div>
            <button onClick={() => setStep(4)} className="w-full bg-white text-black py-3 rounded-full font-semibold mt-4">Next</button>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">One more thing</h2>
            <textarea className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white h-32" placeholder="Short bio — what kind of friend are you looking for?" value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))} />
            <button onClick={handleSubmit} className="w-full bg-white text-black py-3 rounded-full font-semibold">Find my matches</button>
          </div>
        )}
      </div>
    </main>
  )
}