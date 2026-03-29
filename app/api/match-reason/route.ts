import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { me, match } = await req.json()

  const prompt = `You are a friendship matchmaking assistant for men. Given two profiles, write a single short sentence (max 20 words) explaining why these two guys would get along as friends. Be specific, casual, and direct.

Profile 1:
Name: ${me.name}, Age: ${me.age}, City: ${me.city}
Life stage: ${me.life_stage}
Interests: ${me.interests?.join(', ')}
Bio: ${me.bio}

Profile 2:
Name: ${match.name}, Age: ${match.age}, City: ${match.city}
Life stage: ${match.life_stage}
Interests: ${match.interests?.join(', ')}
Bio: ${match.bio}

Write only the sentence, no preamble.`

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  })

  const data = await res.json()
  const reason = data.candidates?.[0]?.content?.parts?.[0]?.text || 'You two have a lot in common.'

  return NextResponse.json({ reason })
}