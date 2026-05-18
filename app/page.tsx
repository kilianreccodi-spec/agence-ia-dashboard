"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const agents = [
  { id: 1, name: "Alex", role: "Gestion email", dept: "Communication", tools: ["Gmail", "Outlook"], status: "active", task: "Traite 8 emails en attente" },
  { id: 2, name: "Tom", role: "Relance inactifs", dept: "Commercial", tools: ["HubSpot", "Gmail"], status: "active", task: "Relance 12 leads dormants" },
  { id: 3, name: "Lucas", role: "Veille concurrentielle", dept: "Stratégie", tools: ["Google", "LinkedIn", "Slack"], status: "active", task: "Scan hebdomadaire en cours" },
  { id: 4, name: "Clara", role: "Suivi client post-vente", dept: "Relation client", tools: ["Gmail", "HubSpot", "Calendly"], status: "active", task: "Envoie suivi J+7 · 3 clients" },
  { id: 5, name: "Romain", role: "Recrutement", dept: "RH", tools: ["Gmail", "Notion"], status: "pending", task: "Attend validation · 2 CVs" },
  { id: 6, name: "Sarah", role: "Facturation automatique", dept: "Admin", tools: ["Gmail", "Notion", "Pennylane"], status: "active", task: "Facture #2026-089 générée" },
];

const tasks = {
  ongoing: [
    { title: "Tri emails entrants · 8 messages", agent: "Alex", time: "il y a 2 min" },
    { title: "Relance · Martin SAS · sans réponse 14j", agent: "Tom", time: "il y a 10 min" },
    { title: "Scan concurrents · secteur immobilier", agent: "Lucas", time: "il y a 18 min" },
    { title: "Suivi post-vente · Sophie Renard J+7", agent: "Clara", time: "il y a 25 min" },
    { title: "Analyse CV · poste commercial", agent: "Romain", time: "il y a 40 min" },
  ],
  validation: [
    { title: "Réponse email · client Dupont SAS", agent: "Alex · attend validation", time: "1h" },
    { title: "Facture #2026-089 · 3 400 € · Lambert", agent: "Sarah · attend validation", time: "2h" },
    { title: "Relance devis · Martin SAS · 8 200 €", agent: "Tom · attend validation", time: "3h" },
  ],
  done: [
    { title: "Rapport veille · 3 nouveautés concurrents", agent: "Lucas", time: "1h30" },
    { title: "Facture #2026-088 · 1 800 € · envoyée", agent: "Sarah", time: "2h15" },
    { title: "Suivi post-vente · Thomas Girard J+30", agent: "Clara", time: "3h00" },
    { title: "CV scorés · 12 candidats · top 3 identifiés", agent: "Romain", time: "4h20" },
    { title: "Relance · 8 leads · 2 réponses positives", agent: "Tom", time: "5h10" },
  ],
};

const activity = [
  { time: "14:22", text: "Alex a trié 8 emails · 2 réponses envoyées · 1 en attente de validation", tag: "Email" },
  { time: "13:45", text: "Sarah a généré la facture #2026-089 · 3 400 € · client Lambert · en attente de validation", tag: "Admin" },
  { time: "13:12", text: "Tom a relancé Martin SAS · sans réponse depuis 14 jours · réponse positive reçue", tag: "Commercial" },
  { time: "12:48", text: "Lucas a détecté 3 nouveautés chez la concurrence · rapport envoyé par email", tag: "Stratégie" },
  { time: "11:55", text: "Clara a envoyé un suivi post-vente à Sophie Renard · demande d'avis Google incluse", tag: "Relation client" },
];

export default function Dashboard() {
  const [view, setView] = useState("dashboard");
  const [dark, setDark] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    supabase.from("leads").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setLeads(data);
    });
  }, []);

  const c = dark ? {
    bg: "#0f0f0e", sidebar: "#181816", border: "#2e2e2b", card: "#1e1e1b",
    cardAlt: "#252522", text: "#f0ede6", textSub: "#c8c4bb", textMuted: "#9a968d",
    textFaint: "#6a6660", accent: "#e0b060", accentBg: "#e0b06020", accentBorder: "#e0b06050",
    green: "#6dba3a", tagBg: "#252522", hover: "#242420",
  } : {
    bg: "#f2f0eb", sidebar: "#ffffff", border: "#d4d0c8", card: "#ffffff",
    cardAlt: "#ebe8e0", text: "#18180f", textSub: "#3a3830", textMuted: "#5a5750",
    textFaint: "#7a7770", accent: "#9a6e1a", accentBg: "#9a6e1a15", accentBorder: "#9a6e1a40",
    green: "#2a7010", tagBg: "#e8e4da", hover: "#eae6de",
  };

  const tr = { transition: "background 0.2s, color 0.2s, border-color 0.2s" };

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "agents", label: "Agents" },
    { id: "tasks", label: "Task Board" },
    { id: "org", label: "Organigramme" },
    { id: "pricing", label: "Offre" },
  ];

  return (
    <div style={{ ...tr, display: "flex", height: "100vh", background: c.bg, color: c.text, overflow: "hidden", fontFamily: "DM Sans, sans-serif" }}>
      <aside style={{ ...tr, width: 200, background: c.sidebar, borderRight: `1px solid ${c.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "18px 16px", borderBottom: `1px solid ${c.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: c.text }}>◆ Optima Flow</div>
          <div style={{ fontSize: 11, color: c.textFaint, marginTop: 4 }}>platform.optimaflow.ai</div>
        </div>
        <nav style={{ padding: "14px 10px", display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          <div style={{ fontSize: 10, color: c.textFaint, letterSpacing: "1px", textTransform: "uppercase", padding: "0 8px", marginBottom: 6 }}>Navigation</div>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setView(item.id)} style={{
              // ✅ FIX: border: "none" déplacé AVANT borderLeft pour ne pas l'écraser
              ...tr, textAlign: "left", fontSize: 13, padding: "8px 12px", borderRadius: 6,
              background: view === item.id ? c.hover : "transparent",
              color: view === item.id ? c.text : c.textMuted,
              border: "none",
              borderLeft: `2px solid ${view === item.id ? c.accent : "transparent"}`,
              cursor: "pointer", outline: "none",
              fontWeight: view === item.id ? 500 : 400,
            }}>{item.label}</button>
          ))}
          <a href="/agent" style={{ ...tr, textAlign: "left", fontSize: 13, padding: "8px 12px", borderRadius: 6, background: "transparent", color: c.textMuted, borderLeft: "2px solid transparent", textDecoration: "none", display: "block", marginTop: 4 }}>Démo agent</a>
        </nav>
        <div style={{ padding: "14px 16px", borderTop: `1px solid ${c.border}` }}>
          <button onClick={() => setDark(!dark)} style={{ ...tr, width: "100%", fontSize: 12, padding: "8px 12px", borderRadius: 6, background: c.hover, color: c.textSub, border: `1px solid ${c.border}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{dark ? "☾ Mode sombre" : "○ Mode clair"}</span>
            <span style={{ fontSize: 10, color: c.textFaint }}>basculer</span>
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>

        {view === "dashboard" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: c.text }}>Dashboard — Optima Flow</h1>
              <div style={{ ...tr, fontSize: 11, color: c.textMuted, background: c.card, border: `1px solid ${c.border}`, padding: "5px 12px", borderRadius: 5, textAlign: "right", lineHeight: 1.7 }}>DONNÉES EN DIRECT<br />Connecté à Supabase</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Leads total", value: leads.length.toString(), delta: "Données réelles Supabase", dc: c.green },
                { label: "Leads qualifiés", value: leads.filter(l => l.statut === "qualifié").length.toString(), delta: "Statut qualifié", dc: c.green },
                { label: "Score moyen", value: leads.length > 0 ? Math.round(leads.reduce((a, l) => a + (l.score || 0), 0) / leads.length).toString() : "0", delta: "Moyenne des scores", dc: c.accent },
                { label: "Nouveaux leads", value: leads.filter(l => l.statut === "nouveau").length.toString(), delta: "Statut nouveau", dc: c.green },
              ].map((k, i) => (
                <div key={i} style={{ ...tr, background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: c.text }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: k.dc, marginTop: 4 }}>{k.delta}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: 600, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>
              Leads — données réelles {leads.length > 0 ? `(${leads.length})` : "(aucun lead)"}
            </div>

            <div style={{ ...tr, background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, overflow: "hidden" }}>
              {leads.length > 0 ? leads.map((lead, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "12px 16px", borderBottom: i < leads.length - 1 ? `1px solid ${c.border}` : "none", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12, color: c.textFaint, minWidth: 44, fontWeight: 500 }}>
                    {new Date(lead.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span style={{ fontSize: 12, color: c.textSub, flex: 1, lineHeight: 1.5 }}>
                    {lead.nom} · {lead.email} · Score {lead.score}
                  </span>
                  <span style={{ fontSize: 10, background: c.tagBg, border: `1px solid ${c.border}`, color: c.textMuted, padding: "2px 10px", borderRadius: 4, whiteSpace: "nowrap", fontWeight: 500 }}>
                    {lead.statut}
                  </span>
                </div>
              )) : activity.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "12px 16px", borderBottom: i < activity.length - 1 ? `1px solid ${c.border}` : "none", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12, color: c.textFaint, minWidth: 44, fontWeight: 500 }}>{a.time}</span>
                  <span style={{ fontSize: 12, color: c.textSub, flex: 1, lineHeight: 1.5 }}>{a.text}</span>
                  <span style={{ fontSize: 10, background: c.tagBg, border: `1px solid ${c.border}`, color: c.textMuted, padding: "2px 10px", borderRadius: 4, whiteSpace: "nowrap", fontWeight: 500 }}>{a.tag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "agents" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: c.text }}>Agents — {agents.length} déployés</h1>
              <div style={{ ...tr, fontSize: 11, color: c.textMuted, background: c.card, border: `1px solid ${c.border}`, padding: "5px 12px", borderRadius: 5 }}>Tous actifs sauf 1 en attente</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {agents.map((agent) => (
                <div key={agent.id} style={{ ...tr, background: c.card, border: `1px solid ${agent.status === "pending" ? c.accentBorder : c.border}`, borderRadius: 10, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.cardAlt, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: c.textSub }}>{agent.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{agent.name}</div>
                      <div style={{ fontSize: 10, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 1 }}>{agent.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{agent.dept}</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
                    {agent.tools.map((tool) => (
                      <span key={tool} style={{ fontSize: 10, background: c.tagBg, border: `1px solid ${c.border}`, color: c.textMuted, padding: "3px 8px", borderRadius: 4, fontWeight: 500 }}>{tool}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: c.textMuted }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: agent.status === "active" ? c.green : c.accent }} />
                      {agent.task}
                    </div>
                    <button style={{ fontSize: 11, background: c.accentBg, color: c.accent, border: `1px solid ${c.accentBorder}`, padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontWeight: 500 }}>Parler</button>
                  </div>
                </div>
              ))}
              <div style={{ background: c.card, border: `1px dashed ${c.border}`, borderRadius: 10, padding: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 180 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1px dashed ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: c.textFaint, fontSize: 20 }}>+</div>
                <div style={{ fontSize: 12, color: c.textMuted, textAlign: "center", lineHeight: 1.6 }}>Ajouter un agent<br /><span style={{ fontSize: 10, color: c.textFaint }}>Extension future</span></div>
              </div>
            </div>
          </div>
        )}

        {view === "tasks" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: c.text }}>Task Board · Temps réel</h1>
              <div style={{ fontSize: 11, color: c.textMuted, background: c.card, border: `1px solid ${c.border}`, padding: "5px 12px", borderRadius: 5 }}>Mis à jour il y a 8 secondes</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {[
                { title: "En cours", color: c.textSub, items: tasks.ongoing, ib: c.border },
                { title: "Validation requise", color: c.accent, items: tasks.validation, ib: c.accentBorder },
                { title: "Terminé · 24h", color: c.green, items: tasks.done, ib: c.border },
              ].map((col) => (
                <div key={col.title}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: col.color }}>{col.title}</span>
                    <span style={{ fontSize: 11, background: c.cardAlt, color: c.textMuted, padding: "2px 10px", borderRadius: 20, fontWeight: 500 }}>{col.items.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {col.items.map((item, i) => (
                      <div key={i} style={{ background: c.card, border: `1px solid ${col.ib}`, borderRadius: 8, padding: "10px 14px" }}>
                        <div style={{ fontSize: 12, color: c.text, marginBottom: 5, lineHeight: 1.4, fontWeight: 500 }}>{item.title}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: c.textMuted }}>
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

        {/* ✅ FIX: fragment <> </> pour wrapper les deux divs adjacentes */}
        {view === "org" && (
          <>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
                <h1 style={{ fontSize: 18, fontWeight: 600, color: c.text }}>Organigramme agentique</h1>
                <div style={{ fontSize: 11, color: c.textMuted, background: c.card, border: `1px solid ${c.border}`, padding: "5px 12px", borderRadius: 5 }}>5 agents · 4 départements</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                <div style={{ background: c.cardAlt, border: `1px solid ${c.accentBorder}`, padding: "12px 28px", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Pilotage humain</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.accent }}>Kilian · Fondateur</div>
                </div>
                <div style={{ width: 1, height: 24, background: c.border }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, width: "100%" }}>
                  {[
                    { name: "Commercial", agents: ["Tom · Relance inactifs"] },
                    { name: "Communication", agents: ["Alex · Gestion email"] },
                    { name: "Stratégie", agents: ["Lucas · Veille concurrentielle"] },
                    { name: "Relation client", agents: ["Clara · Suivi post-vente"] },
                    { name: "RH", agents: ["Romain · Recrutement"] },
                    { name: "Admin", agents: ["Sarah · Facturation"] },
                  ].map((dep) => (
                    <div key={dep.name}>
                      <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 14px", textAlign: "center", marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: c.textSub }}>{dep.name}</div>
                      </div>
                      {dep.agents.map((a) => (
                        <div key={a} style={{ background: c.cardAlt, border: `1px solid ${c.border}`, borderRadius: 6, padding: "7px 12px", textAlign: "center", marginBottom: 5 }}>
                          <div style={{ fontSize: 12, color: c.textMuted, fontWeight: 500 }}>{a}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40, marginTop: 24, width: "100%" }}>
              {([["6", "Agents déployés"], ["6", "Départements couverts"], ["145 000 €", "Économies estimées / an"]] as [string, string][]).map(([v, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: c.accent }}>{v}</div>
                  <div style={{ fontSize: 10, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: 6, fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === "pricing" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: c.text }}>L&apos;offre en 3 leviers</h1>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
              {[
                { num: "01", name: "Le setup", desc: "L'infrastructure initiale. Audit, architecture agentique, premiers agents déployés.", price: "3 000 € à +10 000 €", features: ["Audit de l'entreprise", "Architecture des agents", "Intégration outils existants", "Formation équipe", "Dashboard de pilotage"], featured: false },
                { num: "02", name: "Le mensuel", desc: "Tu restes en CAIO externe. Tu testes, améliores, implémentes chaque mois.", price: "500 € à 2 000 €/mois", features: ["Suivi performance agents", "Nouveaux agents chaque mois", "Optimisation continue", "Reporting mensuel client", "Support prioritaire"], featured: true },
                { num: "03", name: "La perf.", desc: "Prime sur résultats. L'IA déclenche du CA mesurable.", price: "5 à 15% du CA généré", features: ["Tracking CA précis", "Agents commerciaux dédiés", "Zéro risque client", "Alignement total d'intérêts", "Reporting CA temps réel"], featured: false },
              ].map((plan) => (
                <div key={plan.num} style={{ background: plan.featured ? c.cardAlt : c.card, border: `1px solid ${plan.featured ? c.accentBorder : c.border}`, borderRadius: 12, padding: 28 }}>
                  <div style={{ fontSize: 10, color: c.textFaint, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8, fontWeight: 600 }}>{plan.num}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: c.accent, marginBottom: 10 }}>{plan.name}</div>
                  <div style={{ fontSize: 12, color: c.textMuted, marginBottom: 20, lineHeight: 1.7 }}>{plan.desc}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${c.border}` }}>{plan.price}</div>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: c.textSub }}>
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
  );
}