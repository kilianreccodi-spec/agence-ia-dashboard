"use client";
import { useState, useEffect, useRef } from "react";

const LEADS = [
  { nom: "Jean Dupont", entreprise: "Dupont Immobilier", email: "jean@dupont.fr", jours: 13, statut: "qualifié", score: 84 },
  { nom: "Marie Martin", entreprise: "Martin & Co", email: "marie@martin.fr", jours: 9, statut: "qualifié", score: 91 },
  { nom: "Thomas Dubois", entreprise: "Cabinet Dubois", email: "thomas@dubois.fr", jours: 11, statut: "en cours", score: 67 },
  { nom: "Sophie Renard", entreprise: "Renard Conseil", email: "sophie@renard.fr", jours: 15, statut: "nouveau", score: 45 },
  { nom: "Pierre Lambert", entreprise: "Lambert SA", email: "pierre@lambert.fr", jours: 8, statut: "qualifié", score: 88 },
  { nom: "Julie Bernard", entreprise: "Bernard Group", email: "julie@bernard.fr", jours: 14, statut: "en cours", score: 72 },
];

const RELANCES_GENEREES = [
  { nom: "Jean Dupont", message: "Bonjour Jean, je voulais reprendre contact suite à notre dernier échange. Votre projet avance-t-il comme prévu ? Je suis disponible si vous avez des questions.", statut: "brouillon" },
  { nom: "Marie Martin", message: "Bonjour Marie, cela fait quelques jours que nous ne nous sommes pas parlé. Avez-vous eu l'occasion de réfléchir à notre proposition ? Je reste à votre disposition.", statut: "brouillon" },
  { nom: "Thomas Dubois", message: "Bonjour Thomas, je tenais à reprendre contact avec vous. Est-ce que votre situation a évolué depuis notre dernier échange ?", statut: "brouillon" },
];

const SUGGESTIONS = [
  "Quels leads dois-je relancer aujourd'hui ?",
  "Montre-moi les relances générées",
  "Quel est mon lead le plus prometteur ?",
  "Combien de temps je récupère par semaine ?",
];

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function TomPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Bonjour, je suis Tom, votre agent de relance commerciale.\n\nJ'ai analysé votre base de leads ce matin — 6 contacts sont inactifs depuis plus de 7 jours. J'ai préparé des messages de relance personnalisés pour chacun, prêts à envoyer.\n\nComment puis-je vous aider ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const [showSuggests, setShowSuggests] = useState(true);
  const [seconds, setSeconds] = useState(8);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "leads">("chat");
  const [activeRelance, setActiveRelance] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const history = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  async function send(text?: string) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setShowSuggests(false);
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    history.current.push({ role: "user", content: msg });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.current, agentId: "tom" }),
      });
      const data = await res.json();
      const reply = data.reply || "Je rencontre une difficulté. Réessayez.";
      history.current.push({ role: "assistant", content: reply });
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Erreur de connexion." }]);
    }
    setLoading(false);
  }

  const c = dark
    ? {
        bg: "#0f0f0e", sidebar: "#181816", border: "#2e2e2b", card: "#1e1e1b",
        cardAlt: "#252522", text: "#f0ede6", textSub: "#c8c4bb", textMuted: "#9a968d",
        textFaint: "#6a6660", accent: "#e0b060", green: "#6dba3a", hover: "#242420",
        blue: "#4a9eff", blueBg: "#0a1a30", orange: "#e87722", orangeBg: "#2a1500",
      }
    : {
        bg: "#f2f0eb", sidebar: "#ffffff", border: "#d4d0c8", card: "#ffffff",
        cardAlt: "#ebe8e0", text: "#18180f", textSub: "#3a3830", textMuted: "#5a5750",
        textFaint: "#7a7770", accent: "#9a6e1a", green: "#2a7010", hover: "#eae6de",
        blue: "#1a5fc8", blueBg: "#e8f0ff", orange: "#c85a00", orangeBg: "#fff0e0",
      };

  const tr = { transition: "background 0.2s, color 0.2s, border-color 0.2s" };

  const joursColor = (j: number) => j >= 14 ? "#e84040" : j >= 10 ? c.accent : c.green;

  const LeadsPanel = () => (
    <div style={{ ...tr, background: c.card, border: isMobile ? "none" : `1px solid ${c.border}`, borderRadius: isMobile ? 0 : 12, display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
      <div style={{ ...tr, padding: "12px 16px", borderBottom: `1px solid ${c.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: c.textSub }}>Leads inactifs détectés</div>
        <div style={{ fontSize: 10, color: c.textFaint }}>Mis à jour il y a {seconds}s</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>

        {/* Stats rapides */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
          {([
            ["6", "Inactifs", "#e84040"],
            ["3", "Brouillons prêts", c.green],
            ["8j", "Délai moyen", c.accent],
          ] as [string, string, string][]).map(([v, l, col]) => (
            <div key={l} style={{ ...tr, background: c.cardAlt, border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: col }}>{v}</div>
              <div style={{ fontSize: 9, color: c.textFaint, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Liste leads */}
        <div style={{ fontSize: 10, fontWeight: 600, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>Leads à relancer</div>
        {LEADS.map((lead, i) => (
          <div key={i} style={{ ...tr, background: c.cardAlt, border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 6, cursor: "pointer" }}
            onClick={() => setActiveRelance(activeRelance === i ? null : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{lead.nom}</div>
                <div style={{ fontSize: 10, color: c.textMuted, marginTop: 1 }}>{lead.entreprise}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: joursColor(lead.jours) }}>{lead.jours}j sans contact</span>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 20, background: c.border, color: c.textMuted }}>{lead.statut}</span>
              </div>
            </div>

            {/* Message de relance si actif */}
            {activeRelance === i && RELANCES_GENEREES[i] && (
              <div style={{ marginTop: 10, padding: "8px 10px", background: dark ? "#1a2a10" : "#f0f8e8", border: `1px solid ${c.green}`, borderRadius: 6 }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: c.green, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Brouillon généré par Tom</div>
                <div style={{ fontSize: 11, color: c.textSub, lineHeight: 1.5 }}>{RELANCES_GENEREES[i].message}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button style={{ fontSize: 10, padding: "3px 10px", background: c.green, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}>Envoyer</button>
                  <button style={{ ...tr, fontSize: 10, padding: "3px 10px", background: "transparent", color: c.textMuted, border: `1px solid ${c.border}`, borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}>Modifier</button>
                </div>
              </div>
            )}

            {activeRelance === i && !RELANCES_GENEREES[i] && (
              <div style={{ marginTop: 8, padding: "6px 10px", background: c.orangeBg, border: `1px solid ${c.orange}`, borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: c.orange }}>Brouillon en cours de génération...</div>
              </div>
            )}
          </div>
        ))}

        <div style={{ fontSize: 10, color: c.textFaint, textAlign: "center", marginTop: 8 }}>
          Cliquez sur un lead pour voir le message de relance
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ ...tr, display: "flex", flexDirection: "column", height: "100vh", background: c.bg, color: c.text, fontFamily: "DM Sans, sans-serif", overflow: "hidden" }}>
      <style>{`@keyframes pulse{0%,80%,100%{opacity:0.3}40%{opacity:1}}`}</style>

      {/* TOP BAR */}
      <div style={{ ...tr, display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "10px 14px" : "14px 24px", borderBottom: `1px solid ${c.border}`, background: c.sidebar, flexShrink: 0 }}>
        {isMobile && (
          <a href="/" style={{ fontSize: 18, color: c.textMuted, textDecoration: "none", marginRight: 4 }}>‹</a>
        )}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginRight: 8 }}>
            <a href="/" style={{ ...tr, fontSize: 12, padding: "5px 10px", borderRadius: 6, background: c.hover, color: c.textMuted, border: `1px solid ${c.border}`, textDecoration: "none", flexShrink: 0 }}>← Retour</a>
            <div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>◆ Optima Flow</div>
          </div>
        )}
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.green, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: c.text }}>Tom — Agent relance commerciale</div>
          <div style={{ fontSize: 10, color: c.textFaint, marginTop: 1 }}>Actif · 6 leads inactifs détectés · 3 brouillons prêts</div>
        </div>
        <button onClick={() => setDark(!dark)} style={{ ...tr, fontSize: 11, padding: "5px 10px", borderRadius: 6, background: c.hover, color: c.textSub, border: `1px solid ${c.border}`, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
          {dark ? "☾" : "○"}
        </button>
        {!isMobile && (
          <div style={{ ...tr, fontSize: 10, color: c.textMuted, background: c.card, border: `1px solid ${c.border}`, padding: "4px 10px", borderRadius: 4, flexShrink: 0 }}>DÉMO INTERACTIVE · OPTIMA FLOW</div>
        )}
      </div>

      {/* MOBILE TABS */}
      {isMobile && (
        <div style={{ ...tr, display: "flex", borderBottom: `1px solid ${c.border}`, background: c.sidebar, flexShrink: 0 }}>
          {(["chat", "leads"] as const).map((tab) => (
            <button key={tab} onClick={() => setMobileTab(tab)} style={{
              ...tr, flex: 1, padding: "10px", fontSize: 12, fontWeight: mobileTab === tab ? 600 : 400,
              color: mobileTab === tab ? c.accent : c.textMuted,
              background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit",
              borderBottom: `2px solid ${mobileTab === tab ? c.accent : "transparent"}`,
            }}>
              {tab === "chat" ? "Conversation" : "Leads inactifs"}
            </button>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div style={{ flex: 1, display: isMobile ? "flex" : "grid", gridTemplateColumns: isMobile ? undefined : "1fr 1fr", flexDirection: "column", gap: isMobile ? 0 : 16, padding: isMobile ? 0 : 20, overflow: "hidden" }}>

        {/* Chat */}
        {(!isMobile || mobileTab === "chat") && (
          <div style={{ ...tr, background: c.card, border: isMobile ? "none" : `1px solid ${c.border}`, borderRadius: isMobile ? 0 : 12, display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
            {!isMobile && (
              <div style={{ ...tr, padding: "12px 16px", borderBottom: `1px solid ${c.border}`, fontSize: 12, fontWeight: 500, color: c.textSub }}>Conversation avec Tom</div>
            )}
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: m.role === "user" ? c.cardAlt : "#2a3a50", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: m.role === "user" ? c.textSub : c.blue }}>
                    {m.role === "user" ? "V" : "T"}
                  </div>
                  <div style={{ maxWidth: "78%", padding: "9px 12px", fontSize: 12, lineHeight: 1.6, borderRadius: m.role === "user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px", background: m.role === "user" ? "#1a2a40" : c.cardAlt, color: m.role === "user" ? "#90c0f0" : c.text, whiteSpace: "pre-wrap" }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2a3a50", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: c.blue }}>T</div>
                  <div style={{ padding: "12px 16px", background: c.cardAlt, borderRadius: "4px 12px 12px 12px", display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: c.textFaint, animation: `pulse 1.2s ${d}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {showSuggests && (
              <div style={{ padding: "8px 14px", display: "flex", flexWrap: "wrap", gap: 5 }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} style={{ ...tr, fontSize: 11, padding: "5px 10px", border: `0.5px solid ${c.border}`, borderRadius: 20, background: c.cardAlt, color: c.textMuted, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
                ))}
              </div>
            )}
            <div style={{ ...tr, padding: "10px 14px", borderTop: `1px solid ${c.border}`, display: "flex", gap: 8 }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Écrivez à Tom..." style={{ ...tr, flex: 1, padding: "8px 12px", fontSize: 12, border: `1px solid ${c.border}`, borderRadius: 8, background: c.cardAlt, color: c.text, outline: "none", fontFamily: "inherit" }} />
              <button onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: "8px 16px", background: c.blue, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "inherit", opacity: loading || !input.trim() ? 0.5 : 1 }}>Envoyer</button>
            </div>
          </div>
        )}

        {/* Leads Panel */}
        {(!isMobile || mobileTab === "leads") && <LeadsPanel />}
      </div>
    </div>
  );
}
