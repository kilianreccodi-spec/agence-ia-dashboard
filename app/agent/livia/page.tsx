"use client";
import { useState, useEffect, createElement } from "react";

// Agent ElevenLabs "réceptionniste maritime IA" (Livia).
// Surchargeable via NEXT_PUBLIC_ELEVENLABS_AGENT_ID si besoin.
const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "agent_0001kw9ewf98eayaxwv28d7jkzcp";

const CAPACITES = [
  { titre: "Répond aux appels 24/7", detail: "Aucun appel manqué, même le soir et le week-end." },
  { titre: "Vérifie l'agenda en direct", detail: "Elle consulte les disponibilités réelles avant de proposer un créneau." },
  { titre: "Pose le rendez-vous", detail: "L'événement est créé automatiquement dans Google Agenda." },
  { titre: "Propose une alternative", detail: "Si le créneau est pris, elle propose les prochains horaires libres." },
];

const ETAPES = [
  "L'appelant explique sa demande (estimation, visite, rappel...).",
  "Livia demande le jour et l'heure souhaités.",
  "Elle vérifie la disponibilité dans l'agenda.",
  "Elle confirme et pose le rendez-vous, ou propose un autre créneau.",
];

export default function LiviaPage() {
  const [dark, setDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  // Charge le script du widget ElevenLabs une seule fois.
  useEffect(() => {
    const SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.type = "text/javascript";
    document.body.appendChild(s);
  }, []);

  const c = dark
    ? {
        bg: "#0f0f0e", sidebar: "#181816", border: "#2e2e2b", card: "#1e1e1b",
        cardAlt: "#252522", text: "#f0ede6", textSub: "#c8c4bb", textMuted: "#9a968d",
        textFaint: "#6a6660", accent: "#e0b060", accentBg: "#e0b06020", accentBorder: "#e0b06050",
        green: "#6dba3a", hover: "#242420",
      }
    : {
        bg: "#f2f0eb", sidebar: "#ffffff", border: "#d4d0c8", card: "#ffffff",
        cardAlt: "#ebe8e0", text: "#18180f", textSub: "#3a3830", textMuted: "#5a5750",
        textFaint: "#7a7770", accent: "#9a6e1a", accentBg: "#9a6e1a15", accentBorder: "#9a6e1a40",
        green: "#2a7010", hover: "#eae6de",
      };

  const tr = { transition: "background 0.2s, color 0.2s, border-color 0.2s" };

  return (
    <div style={{ ...tr, display: "flex", flexDirection: "column", height: "100vh", background: c.bg, color: c.text, fontFamily: "DM Sans, sans-serif", overflow: "hidden" }}>

      {/* TOP BAR */}
      <div style={{ ...tr, display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "10px 14px" : "14px 24px", borderBottom: `1px solid ${c.border}`, background: c.sidebar, flexShrink: 0 }}>
        {isMobile && <a href="/" style={{ fontSize: 18, color: c.textMuted, textDecoration: "none", marginRight: 4 }}>‹</a>}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginRight: 8 }}>
            <a href="/" style={{ ...tr, fontSize: 12, padding: "5px 10px", borderRadius: 6, background: c.hover, color: c.textMuted, border: `1px solid ${c.border}`, textDecoration: "none", flexShrink: 0 }}>← Retour</a>
            <div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>◆ Optima Flow</div>
          </div>
        )}
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.green, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: c.text }}>Livia — Réceptionniste vocale IA</div>
          <div style={{ fontSize: 10, color: c.textFaint, marginTop: 1 }}>En ligne · prend les rendez-vous par téléphone</div>
        </div>
        <button onClick={() => setDark(!dark)} style={{ ...tr, fontSize: 11, padding: "5px 10px", borderRadius: 6, background: c.hover, color: c.textSub, border: `1px solid ${c.border}`, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
          {dark ? "☾" : "○"}
        </button>
        {!isMobile && (
          <div style={{ ...tr, fontSize: 10, color: c.textMuted, background: c.card, border: `1px solid ${c.border}`, padding: "4px 10px", borderRadius: 4, flexShrink: 0 }}>DÉMO INTERACTIVE · OPTIMA FLOW</div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? 16 : 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 24, maxWidth: 1100, margin: "0 auto" }}>

          {/* COLONNE GAUCHE — présentation */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ ...tr, background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: c.accentBg, border: `1px solid ${c.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: c.accent, flexShrink: 0 }}>L</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: c.text }}>Livia</div>
                  <div style={{ fontSize: 11, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 2 }}>Relation client · Standard téléphonique</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: c.textSub, lineHeight: 1.7, margin: 0 }}>
                Livia décroche à chaque appel entrant, comprend la demande, vérifie l&apos;agenda et pose
                le rendez-vous, sans intervention humaine. Vos équipes ne perdent plus un seul prospect
                parce que personne n&apos;a pu répondre.
              </p>
            </div>

            <div style={{ ...tr, background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>Ce qu&apos;elle fait</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {CAPACITES.map((cap) => (
                  <div key={cap.titre} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: c.green, fontWeight: 700, fontSize: 13, lineHeight: 1.5, flexShrink: 0 }}>✓</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{cap.titre}</div>
                      <div style={{ fontSize: 12, color: c.textMuted, marginTop: 1, lineHeight: 1.5 }}>{cap.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...tr, background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>Comment se passe un appel</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ETAPES.map((etape, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: c.accentBg, border: `1px solid ${c.accentBorder}`, color: c.accent, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                    <div style={{ fontSize: 12, color: c.textSub, lineHeight: 1.6 }}>{etape}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE — widget live */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ ...tr, background: c.card, border: `1px solid ${c.accentBorder}`, borderRadius: 12, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: c.accent, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Démo en direct</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: c.text, marginBottom: 8 }}>Parlez à Livia maintenant</div>
              <p style={{ fontSize: 13, color: c.textSub, lineHeight: 1.7, margin: "0 auto 18px", maxWidth: 380 }}>
                Cliquez sur le bouton d&apos;appel de Livia (en bas à droite de l&apos;écran), autorisez
                votre micro, et demandez un rendez-vous comme si vous appeliez l&apos;agence.
              </p>

              <div style={{ background: c.cardAlt, border: `1px solid ${c.border}`, borderRadius: 10, padding: 16, textAlign: "left" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>Essayez de dire</div>
                <div style={{ fontSize: 13, color: c.text, lineHeight: 1.6, fontStyle: "italic" }}>
                  « Bonjour, je voudrais un rendez-vous demain à 14h pour un audit gratuit et découvrir ce que vos automatisations pourraient faire pour mon entreprise. »
                </div>
              </div>
            </div>

            <div style={{ ...tr, background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.green, flexShrink: 0, marginTop: 5 }} />
                <div style={{ fontSize: 12, color: c.textMuted, lineHeight: 1.6 }}>
                  Chaque rendez-vous pris pendant la démo apparaît en temps réel dans l&apos;agenda connecté.
                  En production, Livia répond sur votre vraie ligne téléphonique.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Widget vocal ElevenLabs (bouton flottant) */}
      {createElement("elevenlabs-convai", { "agent-id": AGENT_ID })}
    </div>
  );
}
