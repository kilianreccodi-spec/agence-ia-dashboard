import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: 'Tu es Alex, un agent email IA. Reponds toujours en francais en 2-3 phrases max.',
        messages,
      }),
    })
    const data = await res.json()
    if (data.error) return NextResponse.json({ reply: 'Erreur API: ' + data.error.message })
    const reply = data.content?.[0]?.text || 'Pas de reponse.'
    return NextResponse.json({ reply })
  } catch (e) {
    return NextResponse.json({ reply: 'Erreur serveur: ' + e })
  }
}
// updated
