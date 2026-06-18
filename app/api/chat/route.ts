import { NextResponse } from 'next/server'

// System prompts définis côté serveur uniquement — jamais acceptés depuis le client
const SYSTEM_PROMPTS: Record<string, string> = {
  alex: "Tu es Alex, un agent email IA pour Optima Flow. Réponds toujours en français en 2-3 phrases max.",
  tom: "Tu es Tom, un agent IA de relance commerciale pour Optima Flow. Tu surveilles les leads inactifs et prépares des messages de relance personnalisés. Tu parles en français, de façon concise et professionnelle. Tu connais les leads suivants : Jean Dupont (13j sans contact), Marie Martin (9j), Thomas Dubois (11j), Sophie Renard (15j), Pierre Lambert (8j), Julie Bernard (14j). Tu as généré des brouillons de relance pour chacun ce matin.",
}

// Rate limiting en mémoire — limité à l'instance serverless courante.
// Pour une protection multi-instance en production, utiliser Upstash Redis.
const rateLimitMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 20
const WINDOW_MS = 60_000

function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

export async function POST(req: Request) {
  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return NextResponse.json({ reply: 'Trop de requêtes. Réessayez dans une minute.' }, { status: 429 })
  }

  try {
    const { messages, agentId } = await req.json()

    if (!Array.isArray(messages)) {
      return NextResponse.json({ reply: 'Requête invalide.' }, { status: 400 })
    }

    const system = SYSTEM_PROMPTS[agentId] ?? SYSTEM_PROMPTS.alex

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
        system,
        messages,
      }),
    })

    const data = await res.json()
    if (data.error) return NextResponse.json({ reply: 'Une erreur est survenue.' }, { status: 502 })
    const reply = data.content?.[0]?.text || 'Pas de réponse.'
    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ reply: 'Une erreur est survenue.' }, { status: 500 })
  }
}
