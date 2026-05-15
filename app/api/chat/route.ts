import { NextResponse } from 'next/server'

export async function POST(req) {
  const { messages, system } = await req.json()

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system,
      messages,
    }),
  })

  const data = await res.json()
  const reply = data.content?.[0]?.text || 'Erreur.'
  return NextResponse.json({ reply })
}