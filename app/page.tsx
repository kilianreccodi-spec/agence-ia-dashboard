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
    const handler = (e: MediaQueryListEvent) => setDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Palettes haute lisibilité
  const c = dark ? {
    bg:           '#0f0f0e',
    sidebar:      '#181816',
    border:       '#2e2e2b',
    card:         '#1e1e1b',
    cardAlt:      '#252522',
    text:         '#f0ede6',       // très lisible, presque blanc chaud
    textSub:      '#c8c4bb',       // secondaire bien visible
    textMuted:    '#9a968d',       // muted mais lisible
    textFaint:    '#6a6660',       // labels, uppercase
    accent:       '#e0b060',       // or plus lumineux
    accentBg:     '#e0b06020',
    accentBorder: '#e0b06050',
    green:        '#6dba3a',       // vert plus vif
    tagBg:        '#252522',
    hover:        '#242420',
  } : {
    bg:           '#f2f0eb',
    sidebar:      '#ffffff',
    border:       '#d4d0c8',
    card:         '#ffffff',
    cardAlt:      '#ebe8e0',
    text:         '#18180f',       // presque noir
    textSub:      '#3a3830',       // secondaire foncé
    textMuted:    '#5a5750',       // muted lisible
    textFaint:    '#7a7770',       // labels
    accent:       '#9a6e1a',       // or sombre
    accentBg:     '#9a6e1a15',
    accentBorder: '#9a6e1a40',
    green:        '#2a7010',       // vert sombre
    tagBg:        '#e8e4da',
    hover:        '#eae6de',
  }

  const tr = { transition: 'background 0.2s, color 0.2s, border-color 0.2s' }

  return (
    <div style={{ ...tr, display: 'flex', height: '100vh', background: c.bg, color: c.text, overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ ...tr, width: 200, background: c.sidebar, borderRight: `1px solid ${c.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '18px 16px', borderBottom: `1px solid ${c.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: c.text, letterSpacing: '-0.3px' }}>◆ Optima Flow</div>
          <div style={{ fontSize: 11, color: c.textFaint, marginTop: 4 }}>platform.optimaflow.ai</div>
        </div>
        <nav style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          <div style={{ fontSize: 10, color: c.textFaint, letterSpacing: '1px', textTransform: 'uppercase', padding: '0 8px', marginBottom: 6 }}>Navigation</div>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'agents', label: 'Agents' },
            { id: 'tasks', label: 'Task Board' },
            { id: 'org', label: 'Organigramme' },
            { id: 'pricing', label: 'Offre' },
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id)} style={{
              ...tr,
              textAlign: 'left', fontSize: 13, padding: '8px 12px', borderRadius: 6,
              background: view === item.id ? c.hover : 'transparent',
              color: view === item.id ? c.text : c.textMuted,
              borderLeft: `2px solid ${view === item.id ? c.accent : 'transparent'}`,
              cursor: 'pointer', border: 'none', outline: 'none',
              borderLeft: `2px solid ${view === item.id ? c.accent : 'transparent'}`,
              fontWeight: view === item.id ? 500 : 400,
            }}>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${c.border}` }}>
          <button onClick={() => setDark(!dark)} style={{
            ...tr, width: '100%', fontSize: 12, padding: '8px 12px', borderRadius: 6,
            background: c.hover, color: c.textSub, border: `1px solid ${c.border}`,
            cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{dark ? '☾ Mode sombre' : '○ Mode clair'}</span>
            <span style={{ fontSize: 10, color: c.textFaint }}>basculer</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 28 }}>

        {/* DASHBOARD */}
        {view === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: c.text }}>Dashboard — Dupont Conseil SEO</h1>
              <div style={{ ...tr, fontSize: 11, color: c.textMuted, background: c.card, border: `1px solid ${c.border}`, padding: '5px 12px', borderRadius: 5, textAlign: 'right', lineHeight: 1.7 }}>
                EXEMPLE · MAQUETTE<br />Mis à jour il y a 8 secondes
              </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
              {[
                { label: 'Tâches automatisées · 7j', value: '247', delta: '↑ 18% vs semaine précédente', dc: c.green },
                { label: 'Valeur générée · 30j', value: '14 300 €', delta: '↑ 2 480 € vs mois précédent', dc: c.green },
                { label: 'Validations en attente', value: '3', delta: '2 depuis +2h', dc: c.accent, vc: c.accent },
                { label: 'Uptime agents · 30j', value: '98.4%', delta: 'SLA respecté', dc: c.green },
              ].map((k, i) => (
                <div key={i} style={{ ...tr, background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, color: c.textFaint, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: k.vc || c.text }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: k.dc, marginTop: 4 }}>{k.delta}</div>
                </div>
              ))}
            </div>

            {/* Depts */}
            <div style={{ fontSize: 11, fontWeight: 600, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Performance par département</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
              {[
                { name: 'Commercial', rows: [['Leads qualifiés','42'],['RDV bookés','14'],['Deals en cours','7']], pct: 72 },
                { name: 'Email & Comms', rows: [['Emails traités','156'],['Réponses auto','89'],['En attente','12']], pct: 85 },
                { name: 'Admin', rows: [['Factures envoyées','28'],['Relances','11'],['Devis en cours','9']], pct: 55 },
                { name: 'Relation client', rows: [['Clients actifs','24'],['NPS · 30j','72'],['Tickets résolus','89%']], pct: 89 },
              ].map((dep, i) => (
                <div key={i} style={{ ...tr, background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.textSub, marginBottom: 12 }}>{dep.name}</div>
                  {dep.rows.map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0' }}>
                      <span style={{ color: c.textMuted }}>{k}</span>
                      <span style={{ color: c.text, fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ height: 3, background: c.border, borderRadius: 2, marginTop: 12 }}>
                    <div style={{ height: '100%', width: `${dep.pct}%`, background: c.accent, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Activity */}
            <div style={{ fontSize: 11, fontWeight: 600, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Activité récente</div>
            <div style={{ ...tr, background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, overflow: 'hidden' }}>
              {activity.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 16px', borderBottom: i < activity.length - 1 ? `1px solid ${c.border}` : 'none', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 12, color: c.textFaint, minWidth: 44, fontWeight: 500 }}>{a.time}</span>
                  <span style={{ fontSize: 12, color: c.textSub, flex: 1, lineHeight: 1.5 }}>{a.text}</span>
                  <span style={{ fontSize: 10, background: c.tagBg, border: `1px solid ${c.border}`, color: c.textMuted, padding: '2px 10px', borderRadius: 4, whiteSpace: 'nowrap', fontWeight: 500 }}>{a.tag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AGENTS */}
        {view === 'agents' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: c.text }}>Agents — {agents.length} déployés</h1>
              <div style={{ ...tr, fontSize: 11, color: c.textMuted, background: c.card, border: `1px solid ${c.border}`, padding: '5px 12px', borderRadius: 5 }}>Tous actifs sauf 1 en attente</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {agents.map(agent => (
                <div key={agent.id} style={{ ...tr, background: c.card, border: `1px solid ${agent.status === 'pending' ? c.accentBorder : c.border}`, borderRadius: 10, padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ ...tr, width: 36, height: 36, borderRadius: '50%', background: c.cardAlt, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: c.textSub }}>{agent.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{agent.name}</div>
                      <div style={{ fontSize: 10, color: c.textFaint, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 1 }}>{agent.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: c.textFaint, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{agent.dept}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
                    {agent.tools.map(tool => (
                      <span key={tool} style={{ ...tr, fontSize: 10, background: c.tagBg, border: `1px solid ${c.border}`, color: c.textMuted, padding: '3px 8px', borderRadius: 4, fontWeight: 500 }}>{tool}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: c.textMuted }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: agent.status === 'active' ? c.green : c.accent, flexShrink: 0 }} />
                      {agent.task}
                    </div>
                    <button style={{ ...tr, fontSize: 11, background: c.accentBg, color: c.accent, border: `1px solid ${c.accentBorder}`, padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontWeight: 500 }}>Parler</button>
                  </div>
                </div>
              ))}
              <div style={{ ...tr, background: c.card, border: `1px dashed ${c.border}`, borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 180 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: `1px dashed ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.textFaint, fontSize: 20 }}>+</div>
                <div style={{ fontSize: 12, color: c.textMuted, textAlign: 'center', lineHeight: 1.6 }}>Ajouter un agent<br /><span style={{ fontSize: 10, color: c.textFaint }}>Extension future</span></div>
              </div>
            </div>
          </div>
        )}

        {/* TASKS */}
        {view === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: c.text }}>Task Board · Temps réel</h1>
              <div style={{ ...tr, fontSize: 11, color: c.textMuted, background: c.card, border: `1px solid ${c.border}`, padding: '5px 12px', borderRadius: 5 }}>Mis à jour il y a 8 secondes</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {[
                { title: 'En cours', color: c.textSub, items: tasks.ongoing, ib: c.border },
                { title: 'Validation requise', color: c.accent, items: tasks.validation, ib: c.accentBorder },
                { title: 'Terminé · 24h', color: c.green, items: tasks.done, ib: c.border },
              ].map(col => (
                <div key={col.title}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: col.color }}>{col.title}</span>
                    <span style={{ ...tr, fontSize: 11, background: c.cardAlt, color: c.textMuted, padding: '2px 10px', borderRadius: 20, fontWeight: 500 }}>{col.items.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {col.items.map((item, i) => (
                      <div key={i} style={{ ...tr, background: c.card, border: `1px solid ${col.ib}`, borderRadius: 8, padding: '10px 14px' }}>
                        <div style={{ fontSize: 12, color: c.text, marginBottom: 5, lineHeight: 1.4, fontWeight: 500 }}>{item.title}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: c.textMuted }}>
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
              <h1 style={{ fontSize: 18, fontWeight: 600, color: c.text }}>Organigramme agentique</h1>
              <div style={{ ...tr, fontSize: 11, color: c.textMuted, background: c.card, border: `1px solid ${c.border}`, padding: '5px 12px', borderRadius: 5 }}>5 agents · 4 départements</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
              <div style={{ ...tr, background: c.cardAlt, border: `1px solid ${c.accentBorder}`, padding: '12px 28px', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: c.textFaint, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>Pilotage humain</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: c.accent }}>Marc Dupont · Fondateur</div>
              </div>
              <div style={{ width: 1, height: 24, background: c.border }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, width: '100%' }}>
                {[
                  { name: 'Commercial', agents: ['Léa · Qualification','Tom · Relance'] },
                  { name: 'Email & Comms', agents: ['Alex · Emails'] },
                  { name: 'SEO Delivery', agents: ['Marc · Reporting','Sami · Audit','Nina · Positions'] },
                  { name: 'Admin', agents: ['Workflows auto'] },
                ].map(dep => (
                  <div key={dep.name}>
                    <div style={{ ...tr, background: c.card, border: `1px solid ${c.border}`, borderRadius: 8, padding: '10px 14px', textAlign: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: c.textSub }}>{dep.name}</div>
                    </div>
                    {dep.agents.map(a => (
                      <div key={a} style={{ ...tr, background: c.cardAlt, border: `1px solid ${c.border}`, borderRadius: 6, padding: '7px 12px', textAlign: 'center', marginBottom: 5 }}>
                        <div style={{ fontSize: 12, color: c.textMuted, fontWeight: 500 }}>{a}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40, marginTop: 24, width: '100%' }}>
                {[['5','Agents déployés'],['4','Départements couverts'],['145 000 €','Économies estimées / an']].map(([v,l]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: c.accent }}>{v}</div>
                    <div style={{ fontSize: 10, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 6, fontWeight: 500 }}>{l}</div>
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
              <h1 style={{ fontSize: 18, fontWeight: 600, color: c.text }}>L'offre en 3 leviers</h1>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
              {[
                { num: '01', name: 'Le setup', desc: "L'infrastructure initiale. Audit, architecture agentique, premiers agents déployés.", price: '3 000 € à +10 000 €', features: ["Audit de l'entreprise",'Architecture des agents','Intégration outils existants','Formation équipe','Dashboard de pilotage'], featured: false },
                { num: '02', name: 'Le mensuel', desc: "Tu restes en CAIO externe. Tu testes, améliores, implémentes chaque mois.", price: '500 € à 2 000 €/mois', features: ['Suivi performance agents','Nouveaux agents chaque mois','Optimisation continue','Reporting mensuel client','Support prioritaire'], featured: true },
                { num: '03', name: 'La perf.', desc: "Prime sur résultats. L'IA déclenche du CA mesurable.", price: '5 à 15% du CA généré', features: ['Tracking CA précis','Agents commerciaux dédiés','Zéro risque client',"Alignement total d'intérêts",'Reporting CA temps réel'], featured: false },
              ].map(plan => (
                <div key={plan.num} style={{ ...tr, background: plan.featured ? c.cardAlt : c.card, border: `1px solid ${plan.featured ? c.accentBorder : c.border}`, borderRadius: 12, padding: 28 }}>
                  <div style={{ fontSize: 10, color: c.textFaint, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, fontWeight: 600 }}>{plan.num}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: c.accent, marginBottom: 10 }}>{plan.name}</div>
                  <div style={{ fontSize: 12, color: c.textMuted, marginBottom: 20, lineHeight: 1.7 }}>{plan.desc}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${c.border}` }}>{plan.price}</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: c.textSub }}>
                        <span style={{ color: c.green, fontWeight: 700, fontSize: 14 }}>✓</span>{f}
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