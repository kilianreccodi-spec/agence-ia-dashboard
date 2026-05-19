"use client";
import { useState, useEffect, useRef } from "react";

const SUGGESTIONS = [
  "Quels emails attendent ma validation ?",
  "Relance les clients sans réponse",
  "Résume mon activité du jour",
  "Comment tu gères les pièces manquantes ?",
];

const EMAILS = [
  { from: "Sophie Renard · Mutuelle Horizon", subject: "Re: Documents complémentaires", action: "Réponse automatique envoyée · 09:14" },
  { from: "Thomas Girard · Cabinet Legrand", subject: "Demande de rendez-vous", action: "Calendly proposé automatiquement · 10:32" },
  { from: "Marie Dubois · RH Accenture", subject: "Pièces manquantes dossier mars", action: "Relance envoyée · 11:08" },
  { from: "Paul Mercier · SAS Dupont", subject: "Confirmation commande #4821", action: "Accusé de réception envoyé · 11:45" },
];

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Bonjour, je suis Alex, votre agent de gestion email. J'ai traité 12 emails ce matin — 3 réponses envoyées, 2 en attente de votre validation.\n\nComment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const [showSuggests, setShowSuggests] = useState(true);
  const [seconds, setSeconds] = useState(8);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "tasks">("chat");
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
        body: JSON.stringify({ messages: history.current }),
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

  const c = dark ? {
    bg: "#0f0f0e", sidebar: "#181816", border: "#2e2e2b", card: "#1e1e1b",
    cardAlt: "#252522", text: "#f0ede6", textSub: "#c8c4bb", textMuted: "#9a968d",
    textFaint: "#6a6660", accent: "#e0b060", green: "#6dba3a", hover: "#242420",
  } : {
    bg: "#f2f0eb", sidebar: "#ffffff", border: "#d4d0c8", card: "#ffffff",
    cardAlt: "#ebe8e0", text: "#18180f", textSub: "#3a3830", textMuted: "#5a5750",
    textFaint: "#7a7770", accent: "#9a6e1a", green: "#2a7010", hover: "#eae6de",
  };

  const tr = { transition: "background 0.2s, color 0.2s, border-color 0.2s" };

  const TasksPanel = () => (
    <div style={{ ...tr, background: c.card, border: `1px solid ${c.border}`, borderRadius: isMobile ? 0 : 12, display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
      <div style={{ ...tr, padding: "12px 16px", borderBottom: `1px solid ${c.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: c.textSub }}>Tâches en cours</div>
        <div style={{ fontSize: 10, color: c.textFaint }}>Mis à jour il y a {seconds}s</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>En attente de validation</div>
        {[
          { title: "Réponse à Martin SAS — demande de devis", time: "il y a 23 min", badge: "En attente", badgeBg: "#3a2a00", badgeColor: c.accent },
          { title: "Relance client Lambert — facture impayée", time: "il y a 1h", badge: "Votre accord", badgeBg: "#1e1a3a", badgeColor: "#9a8ae0" },
        ].map((t, i) => (
          <div key={i} style={{ ...tr, background: c.cardAlt, border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 12, color: c.text, fontWeight: 500, lineHeight: 1.3, flex: 1 }}>{t.title}</div>
              <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: t.badgeBg, color: t.badgeColor, whiteSpace: "nowrap", flexShrink: 0 }}>{t.badge}</span>
            </div>
            <div style={{ fontSize: 10, color: c.textFaint }}>Alex a rédigé une réponse · {t.time}</div>
          </div>
        ))}
        <div style={{ fontSize: 10, fontWeight: 600, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, marginTop: 16 }}>Emails traités aujourd&apos;hui</div>
        {EMAILS.map((e, i) => (
          <div key={i} style={{ ...tr, borderLeft: `2px solid ${c.green}`, background: c.cardAlt, borderRadius: "0 8px 8px 0", padding: "8px 12px", marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: c.text }}>{e.from}</div>
            <div style={{ fontSize: 11, color: c.textMuted, marginTop: 1 }}>{e.subject}</div>
            <div style={{ fontSize: 10, color: c.green, marginTop: 4 }}>→ {e.action}</div>
          </div>
        ))}
        <div style={{ fontSize: 10, fontWeight: 600, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8, marginTop: 16 }}>Statistiques du jour</div>
        <div style={{ ...tr, background: c.cardAlt, border: `1px solid ${c.border}`, borderRadius: 8, padding: "12px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, textAlign: "center" }}>
            {([["12", "Reçus", c.text], ["9", "Traités", c.green], ["2", "En attente", c.accent]] as [string, string, string][]).map(([v, l, col]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 600, color: col }}>{v}</div>
                <div style={{ fontSize: 10, color: c.textFaint, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ ...tr, display: "flex", flexDirection: "column", height: "100vh", background: c.bg, color: c.text, fontFamily: "DM Sans, sans-serif", overflow: "hidden" }}>
      <style>{`@keyframes pulse{0%,80%,100%{opacity:0.3}40%{opacity:1}}`}</style>

      {/* ── TOP BAR ── */}
      <div style={{ ...tr, display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "10px 14px" : "14px 24px", borderBottom: `1px solid ${c.border}`, background: c.sidebar, flexShrink: 0 }}>
        {isMobile && (
          <a href="/" style={{ fontSize: 18, color: c.textMuted, textDecoration: "none", marginRight: 4 }}>‹</a>
        )}
        {!isMobile && (
          <div style={{ marginRight: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>◆ Optima Flow</div>
          </div>
        )}
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.green, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: c.text }}>Alex — Agent gestion email</div>
          <div style={{ fontSize: 10, color: c.textFaint, marginTop: 1 }}>Actif · 12 emails traités aujourd&apos;hui · répond en direct</div>
        </div>
        <button onClick={() => setDark(!dark)} style={{ ...tr, fontSize: 11, padding: "5px 10px", borderRadius: 6, background: c.hover, color: c.textSub, border: `1px solid ${c.border}`, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
          {dark ? "☾" : "○"}
        </button>
        {!isMobile && (
          <div style={{ ...tr, fontSize: 10, color: c.textMuted, background: c.card, border: `1px solid ${c.border}`, padding: "4px 10px", borderRadius: 4, flexShrink: 0 }}>DÉMO INTERACTIVE · OPTIMA FLOW</div>
        )}
      </div>

      {/* ── MOBILE TABS ── */}
      {isMobile && (
        <div style={{ ...tr, display: "flex", borderBottom: `1px solid ${c.border}`, background: c.sidebar, flexShrink: 0 }}>
          {(["chat", "tasks"] as const).map((tab) => (
            <button key={tab} onClick={() => setMobileTab(tab)} style={{
              ...tr, flex: 1, padding: "10px", fontSize: 12, fontWeight: mobileTab === tab ? 600 : 400,
              color: mobileTab === tab ? c.accent : c.textMuted,
              background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit",
              borderBottom: `2px solid ${mobileTab === tab ? c.accent : "transparent"}`,
            }}>
              {tab === "chat" ? "Conversation" : "Tâches en cours"}
            </button>
          ))}
        </div>
      )}

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, display: isMobile ? "flex" : "grid", gridTemplateColumns: isMobile ? undefined : "1fr 1fr", flexDirection: "column", gap: isMobile ? 0 : 16, padding: isMobile ? 0 : 20, overflow: "hidden" }}>

        {/* Chat */}
        {(!isMobile || mobileTab === "chat") && (
          <div style={{ ...tr, background: c.card, border: isMobile ? "none" : `1px solid ${c.border}`, borderRadius: isMobile ? 0 : 12, display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
            {!isMobile && (
              <div style={{ ...tr, padding: "12px 16px", borderBottom: `1px solid ${c.border}`, fontSize: 12, fontWeight: 500, color: c.textSub }}>Conversation avec Alex</div>
            )}
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: m.role === "user" ? c.cardAlt : "#2a4a10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: m.role === "user" ? c.textSub : c.green }}>
                    {m.role === "user" ? "V" : "A"}
                  </div>
                  <div style={{ maxWidth: "78%", padding: "9px 12px", fontSize: 12, lineHeight: 1.6, borderRadius: m.role === "user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px", background: m.role === "user" ? "#2a4a10" : c.cardAlt, color: m.role === "user" ? "#c8e8a0" : c.text, whiteSpace: "pre-wrap" }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2a4a10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: c.green }}>A</div>
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
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Écrivez à Alex..." style={{ ...tr, flex: 1, padding: "8px 12px", fontSize: 12, border: `1px solid ${c.border}`, borderRadius: 8, background: c.cardAlt, color: c.text, outline: "none", fontFamily: "inherit" }} />
              <button onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: "8px 16px", background: c.green, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "inherit", opacity: loading || !input.trim() ? 0.5 : 1 }}>Envoyer</button>
            </div>
          </div>
        )}

        {/* Tasks */}
        {(!isMobile || mobileTab === "tasks") && <TasksPanel />}
      </div>
    </div>
  );
}
