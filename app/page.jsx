'use client'
import { useState, useEffect } from 'react'

const agents = [
  { id: 1, name: 'Alex', role: 'Gestion emails', dept: 'Communication', tools: ['Gmail', 'Outlook'], status: 'active', task: 'Traite 12 emails en attente' },
  { id: 2, name: 'Léa', role: 'Qualification leads', dept: 'Commercial', tools: ['HubSpot', 'Gmail', 'Calendly'], status: 'active', task: 'Qualifie un nouveau lead' },
  { id: 3, name: 'Marc', role: 'Reporting mensuel', dept: 'SEO Delivery', tools: ['Search Console', 'GA4', 'Ahrefs'], status: 'active', task: 'Génère rapport avril' },
  { id: 4, name: 'Tom', role: 'Relance inactifs', dept: 'Commercial', tools: ['HubSpot', 'LinkedIn', 'Gmail'], status: 'pending', task: 'Attend validation' },
  { id: 5, name: 'Nina', role: 'Suivi positions', dept: 'SEO Delivery', tools: ['SEMrush', 'Notion', 'Slack'], status: 'active', task: 'Scan nocturne en cours' },
]

const tasks = {
  ongoing: [
    { title: 'Tri emails entrants · 12 messages', agent: 'Alex', time: 'il y a 3 min' },
    { title: 'Qualification lead · Michel Bernard', agent: 'Léa', time: 'il y a 8 min' },
    { title: 'Reporting mensuel · Dupont SA', agent: 'Marc', time: 'il y a 15 min' },
    { title: 'Scan positions · portefeuille Q2', agent: 'Nina', time: 'il y a 22 min' },
    { title: 'Relance · 14 leads dormants', agent: 'Tom', time: 'il y a 35 min' },
  ],
  validation: [
    { title: 'Réponse email · client Martin SAS', agent: 'Alex · attend validation', time: '1h' },
    { title: 'Remise tarif 12% · Lambert Conseil', agent: 'Tom · attend Marc', time: '2h' },
    { title: 'Envoi proposition 18 400 € · Aubry', agent: 'Léa · attend Marc', time: '4h' },
  ],
  done: [
    { title: 'Relance pièces manquantes · 8 clients', agent: 'Alex', time: '1h12' },
    { title: 'Audit on-page · e-commerce-mode.fr', agent: 'Marc', time: '2h30' },
    { title: 'Qualif · Catherine Petit · score 91/100', agent: 'Léa', time: '3h44' },
    { title: 'Reporting trimestriel NPS envoyé', agent: 'Marc', time: '4h02' },
    { title: 'Facture #2026-247 · 4 200 €', agent: 'Admin', time: '5h15' },
  ]
}

const activity = [
  { time: '14:22', text: "Alex a trié 12 emails · 3 réponses envoyées · 2 en attente de validation", tag: 'Email' },
  { time: '13:45', text: "Léa a qualifié Michel Bernard · Score 84/100 · RDV proposé jeudi 14h", tag: 'Commercial' },
  { time: '13:12', text: "Marc a envoyé le reporting mensuel à Dupont SA · données S12", tag: 'SEO' },
  { time: '12:48', text: "Tom a relancé 14 leads dormants · 3 réponses positives · 1 RDV proposé", tag: 'Commercial' },
  { time: '11:55', text: "Nina a détecté 6 pertes de positions client Lambert · alerte envoyée", tag: 'SEO' },
]

export default function Dashboard() {
  const [view, setView] = useState('dashboard')
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setDark(mq.matches)
    const handler = (e) => setDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const d = dark ? {
    bg: '#0c0c0b', sidebar: '#111110', border: '#1e1e1c', card: '#141412',
    cardAlt: '#161614', text: '#e8e5de', textSub: '#888885', textMuted: '#555553',
    textFaint: '#444440', accent: '#d4a853', accentBg: '#d4a85318', accentBorder: '#d4a85330',
    green: '#4a7a1e', tagBg: '#161614', hover: '#1a1a18',
  } : {
    bg: '#f8f7f4', sidebar: '#ffffff', border: '#e8e6e0', card: '#ffffff',
    cardAlt: '#f4f2ec', text: '#1a1a18', textSub: '#444440', textMuted: '#666662',
    textFaint: '#888885', accent: '#b8862a', accentBg: '#b8862a12', accentBorder: '#b8862a30',
    green: '#3a6a0e', tagBg: '#f0ede6', hover: '#eeebe4',
  }

  const s = (extra = {}) => ({ transition: 'background 0.2s, color 0.2s, border-color 0.2s', ...extra })

  return (
    <div style={s({ display: 'flex', height: '100vh', background: d.bg, color: d.text, overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" })}>

      {/* Sidebar */}
      <aside style={s({ width: 192, background: d.sidebar, borderRight: `0.5px solid ${d.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 })}>
        <div style={{ padding: 16, borderBottom: `0.5px solid ${d.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: d.text }}>◆ Optima Flow</div>
          <div style={{ fontSize: 10, color: d.textFaint, marginTop: 3 }}>platform.optimaflow.ai</div>
        </div>
        <nav style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <div style={{ fontSize: 9, color: d.textFaint, letterSpacing: '1px', textTransform: 'uppercase', padding: '0 8px', marginBottom: 4 }}>Navigation</div>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'agents', label: 'Agents' },
            { id: 'tasks', label: 'Task Board' },
            { id: 'org', label: 'Organigramme' },
            { id: 'pricing', label: 'Offre' },
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id)} style={{
              textAlign: 'left', fontSize: 12, padding: '7px 10px', borderRadius: 6,
              background: view === item.id ? d.hover : 'transparent',
              color: view === item.id ? d.text : d.textMuted,
              borderLeft: `2px solid ${view === item.id ? d.accent : 'transparent'}`,
              cursor: 'pointer', border: 'none', outline: 'none',
              borderLeft: `2px solid ${view === item.id ? d.accent : 'transparent'}`,
            }}>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: `0.5px solid ${d.border}` }}>
          <button onClick={() => setDark(!dark)} style={s({
            width: '100%', fontSize: 11, padding: '7px 10px', borderRadius: 6,
            background: d.hover, color: d.textMuted, border: `0.5px solid ${d.border}`,
            cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          })}>
            <span>{dark ? '☾ Mode sombre' : '○ Mode clair'}</span>
            <span style={{ fontSize: 9, color: d.textFaint }}>basculer</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

        {/* DASHBOARD */}
        {view === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <h1 style={{ fontSize: 17, fontWeight: 500, color: d.text }}>Dashboard — Dupont Conseil SEO</h1>
              <div style={{ fontSize: 10, color: d.textMuted, background: d.card, border: `0.5px solid ${d.border}`, padding: '4px 10px', borderRadius: 4, textAlign: 'right', lineHeight: 1.6 }}>EXEMPLE · MAQUETTE<br />Mis à jour il y a 8 secondes</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
              {[
                { label: 'Tâches automatisées · 7j', value: '247', delta: '↑ 18% vs semaine précédente', dc: d.green },
                { label: 'Valeur générée · 30j', value: '14 300 €', delta: '↑ 2 480 € vs mois précédent', dc: d.green },
                { label: 'Validations en attente', value: '3', delta: '2 depuis +2h', dc: d.accent, vc: d.accent },
                { label: 'Uptime agents · 30j', value: '98.4%', delta: 'SLA respecté', dc: d.green },
              ].map((k, i) => (
                <div key={i} style={s({ background: d.card, border: `0.5px solid ${d.border}`, borderRadius: 8, padding: 14 })}>
                  <div style={{ fontSize: 9, color: d.textFaint, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{k.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 500, color: k.vc || d.text }}>{k.value}</div>
                  <div style={{ fontSize: 10, color: k.dc, marginTop: 3 }}>{k.delta}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: d.textFaint, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Performance par département</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
              {[
                { name: 'Commercial', rows: [['Leads qualifiés','42'],['RDV bookés','14'],['Deals en cours','7']], pct: 72 },
                { name: 'Email & Comms', rows: [['Emails traités','156'],['Réponses auto','89'],['En attente','12']], pct: 85 },
                { name: 'Admin', rows: [['Factures envoyées','28'],['Relances','11'],['Devis en cours','9']], pct: 55 },
                { name: 'Relation client', rows: [['Clients actifs','24'],['NPS · 30j','72'],['Tickets résolus','89%']], pct: 89 },
              ].map((dep, i) => (
                <div key={i} style={s({ background: d.card, border: `0.5px solid ${d.border}`, borderRadius: 8, padding: 14 })}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: d.textSub, marginBottom: 10 }}>{dep.name}</div>
                  {dep.rows.map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '2px 0' }}>
                      <span style={{ color: d.textMuted }}>{k}</span><span style={{ color: d.textSub }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ height: 2, background: d.border, borderRadius: 1, marginTop: 10 }}>
                    <div style={{ height: '100%', width: `${dep.pct}%`, background: d.accent, opacity: 0.5, borderRadius: 1 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: d.textFaint, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Activité récente</div>
            {activity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: `0.5px solid ${d.border}`, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 11, color: d.textFaint, minWidth: 40 }}>{a.time}</span>
                <span style={{ fontSize: 11, color: d.textSub, flex: 1, lineHeight: 1.5 }}>{a.text}</span>
                <span style={{ fontSize: 9, background: d.tagBg, border: `0.5px solid ${d.border}`, color: d.textMuted, padding: '2px 8px', borderRadius: 3 }}>{a.tag}</span>
              </div>
            ))}
          </div>
        )}

        {/* AGENTS */}
        {view === 'agents' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h1 style={{ fontSize: 17, fontWeight: 500, color: d.text }}>Agents — {agents.length} déployés</h1>
              <div style={s({ fontSize: 10, color: d.textMuted, background: d.card, border: `0.5px solid ${d.border}`, padding: '4px 10px', borderRadius: 4 })}>Tous actifs sauf 1 en attente</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {agents.map(agent => (
                <div key={agent.id} style={s({ background: d.card, border: `0.5px solid ${agent.status === 'pending' ? d.accentBorder : d.border}`, borderRadius: 8, padding: 16 })}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={s({ width: 32, height: 32, borderRadius: '50%', background: d.cardAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: d.textSub })}>{agent.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: d.text }}>{agent.name}</div>
                      <div style={{ fontSize: 9, color: d.textFaint, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{agent.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: d.textFaint, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{agent.dept}</div>
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 12 }}>
                    {agent.tools.map(t => (
                      <span key={t} style={s({ fontSize: 9, background: d.tagBg, border: `0.5px solid ${d.border}`, color: d.textMuted, padding: '2px 6px', borderRadius: 3 })}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: d.textMuted }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: agent.status === 'active' ? d.green : d.accent }} />
                      {agent.task}
                    </div>
                    <button style={s({ fontSize: 10, background: d.accentBg, color: d.accent, border: `0.5px solid ${d.accentBorder}`, padding: '3px 8px', borderRadius: 4, cursor: 'pointer' })}>Parler</button>
                  </div>
                </div>
              ))}
              <div style={s({ background: d.card, border: `0.5px dashed ${d.border}`, borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 160 })}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', border: `0.5px dashed ${d.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: d.textFaint, fontSize: 18 }}>+</div>
                <div style={{ fontSize: 11, color: d.textFaint, textAlign: 'center' }}>Ajouter un agent<br /><span style={{ fontSize: 9 }}>Extension future</span></div>
              </div>
            </div>
          </div>
        )}

        {/* TASKS */}
        {view === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h1 style={{ fontSize: 17, fontWeight: 500, color: d.text }}>Task Board · Temps réel</h1>
              <div style={s({ fontSize: 10, color: d.textMuted, background: d.card, border: `0.5px solid ${d.border}`, padding: '4px 10px', borderRadius: 4 })}>Mis à jour il y a 8 secondes</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { title: 'En cours', color: d.textSub, items: tasks.ongoing, ib: d.border },
                { title: 'Validation requise', color: d.accent, items: tasks.validation, ib: d.accentBorder },
                { title: 'Terminé · 24h', color: d.green, items: tasks.done, ib: d.border },
              ].map(col => (
                <div key={col.title}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: col.color }}>{col.title}</span>
                    <span style={s({ fontSize: 10, background: d.cardAlt, color: d.textFaint, padding: '1px 8px', borderRadius: 20 })}>{col.items.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {col.items.map((item, i) => (
                      <div key={i} style={s({ background: d.card, border: `0.5px solid ${col.ib}`, borderRadius: 6, padding: '8px 10px' })}>
                        <div style={{ fontSize: 11, color: d.textSub, marginBottom: 4, lineHeight: 1.3 }}>{item.title}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: d.textFaint }}>
                          <span>{item.agent}</span><span>{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORG */}
        {view === 'org' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
              <h1 style={{ fontSize: 17, fontWeight: 500, color: d.text }}>Organigramme agentique</h1>
              <div style={s({ fontSize: 10, color: d.textMuted, background: d.card, border: `0.5px solid ${d.border}`, padding: '4px 10px', borderRadius: 4 })}>5 agents · 4 départements</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <div style={s({ background: d.cardAlt, border: `0.5px solid ${d.accentBorder}`, padding: '10px 24px', borderRadius: 6, textAlign: 'center' })}>
                <div style={{ fontSize: 9, color: d.textFaint, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Pilotage humain</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: d.accent, marginTop: 3 }}>Marc Dupont · Fondateur</div>
              </div>
              <div style={{ width: 1, height: 20, background: d.border }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, width: '100%' }}>
                {[
                  { name: 'Commercial', agents: ['Léa · Qualification','Tom · Relance'] },
                  { name: 'Email & Comms', agents: ['Alex · Emails'] },
                  { name: 'SEO Delivery', agents: ['Marc · Reporting','Sami · Audit','Nina · Positions'] },
                  { name: 'Admin', agents: ['Workflows auto'] },
                ].map(dep => (
                  <div key={dep.name}>
                    <div style={s({ background: d.card, border: `0.5px solid ${d.border}`, borderRadius: 6, padding: '8px 12px', textAlign: 'center', marginBottom: 6 })}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: d.textSub }}>{dep.name}</div>
                    </div>
                    {dep.agents.map(a => (
                      <div key={a} style={s({ background: d.cardAlt, border: `0.5px solid ${d.border}`, borderRadius: 4, padding: '6px 10px', textAlign: 'center', marginBottom: 4 })}>
                        <div style={{ fontSize: 11, color: d.textMuted }}>{a}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, marginTop: 20 }}>
                {[['5','Agents déployés'],['4','Départements couverts'],['145 000 €','Économies estimées / an']].map(([v,l]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 500, color: d.accent }}>{v}</div>
                    <div style={{ fontSize: 9, color: d.textFaint, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRICING */}
        {view === 'pricing' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 17, fontWeight: 500, color: d.text }}>L'offre en 3 leviers</h1>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {[
                { num: '01', name: 'Le setup', desc: "L'infrastructure initiale. Audit, architecture agentique, premiers agents déployés.", price: '3 000 € à +10 000 €', features: ["Audit de l'entreprise",'Architecture des agents','Intégration outils existants','Formation équipe','Dashboard de pilotage'], featured: false },
                { num: '02', name: 'Le mensuel', desc: "Tu restes en CAIO externe. Tu testes, améliores, implémentes chaque mois.", price: '500 € à 2 000 €/mois', features: ['Suivi performance agents','Nouveaux agents chaque mois','Optimisation continue','Reporting mensuel client','Support prioritaire'], featured: true },
                { num: '03', name: 'La perf.', desc: "Prime sur résultats. L'IA déclenche du CA mesurable.", price: '5 à 15% du CA généré', features: ['Tracking CA précis','Agents commerciaux dédiés','Zéro risque client',"Alignement total d'intérêts",'Reporting CA temps réel'], featured: false },
              ].map(plan => (
                <div key={plan.num} style={s({ background: plan.featured ? d.cardAlt : d.card, border: `0.5px solid ${plan.featured ? d.accentBorder : d.border}`, borderRadius: 10, padding: 24 })}>
                  <div style={{ fontSize: 9, color: d.textFaint, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>{plan.num}</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: d.accent, marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ fontSize: 11, color: d.textMuted, marginBottom: 16, lineHeight: 1.6 }}>{plan.desc}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: d.text, marginBottom: 16, paddingBottom: 16, borderBottom: `0.5px solid ${d.border}` }}>{plan.price}</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: d.textMuted }}>
                        <span style={{ color: d.green }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}