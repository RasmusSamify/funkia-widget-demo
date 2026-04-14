/**
 * Funkia AB – Premium Chatbot Widget Demo
 * ========================================
 * Single-file React + Tailwind v4 demo.
 * All icons are inline SVG — NO lucide-react.
 * All text in Swedish.
 *
 * CSS Variables:
 *   --funkia-moss:    #2F4A3A
 *   --funkia-moss-dk: #1F3328
 *   --funkia-sage:    #A8BAA0
 *   --funkia-cream:   #F5F1E8
 *   --funkia-sand:    #E8DFC8
 *   --funkia-terra:   #B8734A
 *   --funkia-ink:     #1F2820
 *   --funkia-mist:    #FAF8F2
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   INLINE SVG ICON COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

const LeafIcon = ({ size = 28, color = "#F5F1E8", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5C7 21 9 22 12 22c5.5 0 10-4.5 10-10" />
    <path d="M12 2c2 4 3 8 3 12" />
    <path d="M2 12c4-1 8-1 12 0" />
    <path d="M22 2L12 12" />
  </svg>
);

const CloseIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronLeftIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const PhoneIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const ArrowRightIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const HouseIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const BuildingIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="1" />
    <path d="M9 22V18h6v4" />
    <line x1="8" y1="6" x2="8" y2="6.01" />
    <line x1="12" y1="6" x2="12" y2="6.01" />
    <line x1="16" y1="6" x2="16" y2="6.01" />
    <line x1="8" y1="10" x2="8" y2="10.01" />
    <line x1="12" y1="10" x2="12" y2="10.01" />
    <line x1="16" y1="10" x2="16" y2="10.01" />
    <line x1="8" y1="14" x2="8" y2="14.01" />
    <line x1="12" y1="14" x2="12" y2="14.01" />
    <line x1="16" y1="14" x2="16" y2="14.01" />
  </svg>
);

const PencilIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const PinIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MailIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
);

const ClockIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MenuIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   TYPING INDICATOR (three pulsing dots)
   ═══════════════════════════════════════════════════════════════ */
const TypingIndicator = () => (
  <div className="flex items-end gap-2 mb-4">
    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{ backgroundColor: "var(--funkia-sage)" }}>
      <LeafIcon size={16} color="var(--funkia-moss)" />
    </div>
    <div className="px-4 py-3 rounded-2xl rounded-tl-sm" style={{ backgroundColor: "#EDE9DF" }}>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <span key={i} className="funkia-typing-dot" style={{ animationDelay: `${i * 200}ms` }} />
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   SAM CHAT BUBBLE (left-aligned)
   ═══════════════════════════════════════════════════════════════ */
const SamBubble = ({ text, visible = true, delay = 0 }) => (
  <div className="flex items-end gap-2 mb-4 funkia-msg-in"
    style={{ opacity: visible ? 1 : 0, transitionDelay: `${delay}ms`, transition: "opacity 300ms ease-out, transform 300ms ease-out" }}>
    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{ backgroundColor: "var(--funkia-sage)" }}>
      <LeafIcon size={16} color="var(--funkia-moss)" />
    </div>
    <div className="max-w-[85%]">
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
        style={{ backgroundColor: "#EDE9DF", color: "var(--funkia-ink)" }}>
        {text}
      </div>
      <p className="text-xs mt-1 ml-1" style={{ color: "var(--funkia-sage)" }}>Just nu</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   USER BUBBLE (right-aligned)
   ═══════════════════════════════════════════════════════════════ */
const UserBubble = ({ text }) => (
  <div className="flex justify-end mb-4 funkia-msg-in">
    <div className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white max-w-[85%]"
      style={{ backgroundColor: "var(--funkia-moss)" }}>
      {text}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function FunkiaWidgetDemo() {
  // Widget state
  const [isOpen, setIsOpen] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [screen, setScreen] = useState("home");
  const [screenHistory, setScreenHistory] = useState([]);
  const [requestStep, setRequestStep] = useState(1);
  const [showTyping, setShowTyping] = useState(true);
  const [samVisible, setSamVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    beställartyp: "",
    uppdrag: [],
    skede: "",
    plats: "",
    beskrivning: "",
    namn: "",
    företag: "",
    epost: "",
    telefon: "",
  });
  const [errors, setErrors] = useState({});

  const scrollRef = useRef(null);
  const referenceId = "FK-2026-0414-A7";

  // Inject styles on mount (fonts + keyframes + CSS vars)
  useEffect(() => {
    const styleId = "funkia-widget-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

      :root {
        --funkia-moss: #2F4A3A;
        --funkia-moss-dk: #1F3328;
        --funkia-sage: #A8BAA0;
        --funkia-cream: #F5F1E8;
        --funkia-sand: #E8DFC8;
        --funkia-terra: #B8734A;
        --funkia-ink: #1F2820;
        --funkia-mist: #FAF8F2;
      }

      .font-serif-funkia { font-family: 'Cormorant Garamond', 'Georgia', serif; }
      .font-body-funkia { font-family: 'Inter', system-ui, sans-serif; }

      /* Widget panel entry */
      @keyframes funkia-panel-in {
        0% { opacity: 0; transform: scale(0.92) translateY(16px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      .funkia-panel-enter { animation: funkia-panel-in 400ms ease-out forwards; }

      /* Message slide-in */
      @keyframes funkia-msg-slide {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .funkia-msg-in { animation: funkia-msg-slide 300ms ease-out forwards; }

      /* Card stagger fade */
      @keyframes funkia-card-in {
        0% { opacity: 0; transform: translateY(8px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      /* Typing indicator dots */
      .funkia-typing-dot {
        display: inline-block;
        width: 7px; height: 7px;
        border-radius: 50%;
        background: var(--funkia-sage);
        animation: funkia-dot-pulse 1.2s ease-in-out infinite;
      }
      @keyframes funkia-dot-pulse {
        0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
        30% { opacity: 1; transform: scale(1); }
      }

      /* Ping rings for floating button */
      @keyframes funkia-ping {
        0% { transform: scale(1); opacity: 0.6; }
        100% { transform: scale(1.6); opacity: 0; }
      }

      /* Checkmark animation */
      @keyframes funkia-check-circle {
        0% { stroke-dashoffset: 166; }
        100% { stroke-dashoffset: 0; }
      }
      @keyframes funkia-check-mark {
        0% { stroke-dashoffset: 48; }
        100% { stroke-dashoffset: 0; }
      }
      .funkia-check-circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        animation: funkia-check-circle 600ms ease-out 200ms forwards;
      }
      .funkia-check-mark {
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: funkia-check-mark 400ms ease-out 600ms forwards;
      }

      /* Step fade transition */
      @keyframes funkia-step-fade {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      .funkia-step-enter { animation: funkia-step-fade 200ms ease-out forwards; }

      /* Tooltip bounce */
      @keyframes funkia-hint-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }

      /* Scrollbar styling */
      .funkia-scroll::-webkit-scrollbar { width: 4px; }
      .funkia-scroll::-webkit-scrollbar-track { background: transparent; }
      .funkia-scroll::-webkit-scrollbar-thumb { background: var(--funkia-sand); border-radius: 4px; }
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById(styleId); if (el) el.remove(); };
  }, []);

  // Fade in floating button after 800ms
  useEffect(() => {
    const t = setTimeout(() => setButtonVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Show typing then Sam message on screen changes
  useEffect(() => {
    setShowTyping(true);
    setSamVisible(false);
    setCardsVisible(false);
    const t1 = setTimeout(() => { setShowTyping(false); setSamVisible(true); }, 600);
    const t2 = setTimeout(() => setCardsVisible(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [screen, requestStep]);

  // Scroll to bottom on content changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [screen, requestStep, showTyping, samVisible, cardsVisible]);

  // Navigation helpers
  const navigateTo = useCallback((newScreen) => {
    setScreenHistory(prev => [...prev, screen]);
    setScreen(newScreen);
    if (newScreen === "request") setRequestStep(1);
  }, [screen]);

  const goBack = useCallback(() => {
    if (screen === "request" && requestStep > 1) {
      setRequestStep(prev => prev - 1);
      return;
    }
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory(h => h.slice(0, -1));
      setScreen(prev);
    } else {
      setScreen("home");
    }
  }, [screen, requestStep, screenHistory]);

  const openWidget = () => {
    setIsOpen(true);
    if (!hasOpenedOnce) setHasOpenedOnce(true);
  };

  const closeWidget = () => {
    setIsOpen(false);
  };

  const resetWidget = () => {
    setScreen("home");
    setScreenHistory([]);
    setRequestStep(1);
    setFormData({ beställartyp: "", uppdrag: [], skede: "", plats: "", beskrivning: "", namn: "", företag: "", epost: "", telefon: "" });
    setErrors({});
  };

  // Form helpers
  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const toggleUppdrag = (val) => {
    setFormData(prev => ({
      ...prev,
      uppdrag: prev.uppdrag.includes(val)
        ? prev.uppdrag.filter(v => v !== val)
        : [...prev.uppdrag, val],
    }));
  };

  // Validate step 6 (contact)
  const validateContact = () => {
    const e = {};
    if (!formData.namn.trim()) e.namn = "Namn krävs";
    if (!formData.epost.trim()) e.epost = "E-post krävs";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.epost)) e.epost = "Ogiltig e-postadress";
    if (!formData.telefon.trim()) e.telefon = "Telefon krävs";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Check if next button should be enabled
  const isStepValid = () => {
    switch (requestStep) {
      case 1: return !!formData.beställartyp;
      case 2: return formData.uppdrag.length > 0;
      case 3: return !!formData.skede;
      case 4: return formData.plats.trim().length > 0;
      case 5: return formData.beskrivning.trim().length > 0;
      case 6: return formData.namn.trim() && formData.epost.trim() && formData.telefon.trim();
      default: return true;
    }
  };

  const handleNext = () => {
    if (requestStep === 6) {
      if (!validateContact()) return;
    }
    if (requestStep < 7) setRequestStep(prev => prev + 1);
  };

  const handleSubmit = () => {
    const payload = {
      source: "funkia-widget-demo",
      reference_id: referenceId,
      timestamp: new Date().toISOString(),
      segment: formData.beställartyp,
      contact: { name: formData.namn, company: formData.företag, email: formData.epost, phone: formData.telefon },
      project: { uppdragstyper: formData.uppdrag, skede: formData.skede, ort: formData.plats, beskrivning: formData.beskrivning },
    };
    console.log("═══ FUNKIA PROJEKTFÖRFRÅGAN ═══");
    console.log(JSON.stringify(payload, null, 2));
    // TODO: POST till Autoflow-webhook
    // fetch("https://autoflow.samify.se/webhook/funkia", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    setScreen("done");
    setScreenHistory([]);
  };

  // Show back button on all screens except home and done
  const showBack = screen !== "home" && screen !== "done";

  /* ───────────────────────────────────────────
     SCREEN RENDERERS
     ─────────────────────────────────────────── */

  const renderHome = () => (
    <div className="px-4 py-3">
      {showTyping && <TypingIndicator />}
      {samVisible && (
        <SamBubble text="Hej! 🌿 Jag är Sam, din guide hos Funkia. Vad kan jag hjälpa dig med idag?" />
      )}
      {cardsVisible && (
        <div className="flex flex-col gap-3 mt-2">
          {[
            { icon: <HouseIcon size={28} color="var(--funkia-moss)" />, title: "BRF eller privat beställare", sub: "Förvaltning, gestaltning & upprustning", target: "brf" },
            { icon: <BuildingIcon size={28} color="var(--funkia-moss)" />, title: "Kommun eller byggbolag", sub: "Projektering, dagvatten & ramavtal", target: "kommun" },
            { icon: <PencilIcon size={28} color="var(--funkia-moss)" />, title: "Starta en projektförfrågan", sub: "Få offert inom 24h", target: "request" },
          ].map((card, i) => (
            <button key={card.target}
              onClick={() => navigateTo(card.target)}
              className="group flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-sm"
              style={{
                backgroundColor: "var(--funkia-cream)",
                borderColor: "var(--funkia-sand)",
                animation: `funkia-card-in 300ms ease-out ${i * 100}ms forwards`,
                opacity: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#E8EDDF"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--funkia-cream)"}
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--funkia-sand)" }}>
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: "var(--funkia-ink)" }}>{card.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--funkia-sage)" }}>{card.sub}</p>
              </div>
              <ArrowRightIcon size={18} color="var(--funkia-sage)" className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderServiceScreen = (samText, services) => (
    <div className="px-4 py-3">
      {showTyping && <TypingIndicator />}
      {samVisible && <SamBubble text={samText} />}
      {cardsVisible && (
        <>
          <div className="flex flex-col gap-3 mt-2 mb-4">
            {services.map((s, i) => (
              <div key={i} className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--funkia-cream)",
                  borderColor: "var(--funkia-sand)",
                  animation: `funkia-card-in 300ms ease-out ${i * 100}ms forwards`,
                  opacity: 0,
                }}>
                <p className="font-medium text-sm" style={{ color: "var(--funkia-ink)" }}>{s.title}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6B7B6A" }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2" style={{ animation: "funkia-card-in 300ms ease-out 400ms forwards", opacity: 0 }}>
            <button onClick={() => navigateTo("request")}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "var(--funkia-moss)" }}>
              Starta projektförfrågan
            </button>
            <button onClick={() => navigateTo("contact")}
              className="flex-1 py-3 rounded-xl text-sm font-medium border transition-all duration-200 hover:opacity-80"
              style={{ borderColor: "var(--funkia-sand)", color: "var(--funkia-moss)" }}>
              Kontakta oss
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderBrf = () => renderServiceScreen(
    "Perfekt! Funkia har lång erfarenhet av att arbeta med bostadsrättsföreningar och privata beställare. Här är några av våra vanligaste uppdrag:",
    [
      { title: "Årligt förvaltningsavtal", desc: "Skötselplaner och löpande rådgivning för er utemiljö" },
      { title: "Upprustning av gårdsmiljö", desc: "Ny gestaltning som höjer trivseln och fastighetsvärdet" },
      { title: "Dagvattenlösning", desc: "Hållbar dagvattenhantering anpassad för er fastighet" },
    ]
  );

  const renderKommun = () => renderServiceScreen(
    "Välkommen! Vi samarbetar med kommuner och byggbolag i hela Sverige. Här är exempel på uppdrag vi tar oss an:",
    [
      { title: "Ramavtal landskapsarkitektur", desc: "Löpande stöd i plan- och gestaltningsfrågor" },
      { title: "Dagvattenutredning", desc: "Systemlösningar och blågrön infrastruktur" },
      { title: "Offentliga parkmiljöer", desc: "Gestaltning av parker, torg och lekplatser" },
    ]
  );

  const renderRequest = () => {
    const progress = requestStep / 7;

    const stepPrompts = {
      1: "Först — vilken typ av beställare är du?",
      2: "Vilka typer av uppdrag är du intresserad av?",
      3: "Var befinner sig projektet just nu?",
      4: "Var finns projektet?",
      5: "Beskriv kort vad ni vill åstadkomma.",
      6: "Sist — hur når vi dig?",
      7: "Här är en sammanfattning av din förfrågan:",
    };

    return (
      <div className="px-4 py-3">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium" style={{ color: "var(--funkia-moss)" }}>
              Steg {requestStep} av 7
            </span>
          </div>
          <div className="h-1.5 rounded-full" style={{ backgroundColor: "var(--funkia-sand)" }}>
            <div className="h-full rounded-full transition-all duration-400 ease-out"
              style={{ backgroundColor: "var(--funkia-moss)", width: `${progress * 100}%` }} />
          </div>
        </div>

        {showTyping && <TypingIndicator />}
        {samVisible && <SamBubble text={stepPrompts[requestStep]} />}

        {cardsVisible && (
          <div className="funkia-step-enter">
            {/* Step 1: Beställartyp */}
            {requestStep === 1 && (
              <div className="flex flex-col gap-2 mt-2">
                {["BRF", "Privat", "Kommun", "Byggbolag", "Annat"].map(opt => (
                  <button key={opt}
                    onClick={() => updateForm("beställartyp", opt)}
                    className="p-3 rounded-xl border text-sm text-left transition-all duration-200"
                    style={{
                      backgroundColor: formData.beställartyp === opt ? "var(--funkia-moss)" : "var(--funkia-cream)",
                      borderColor: formData.beställartyp === opt ? "var(--funkia-moss)" : "var(--funkia-sand)",
                      color: formData.beställartyp === opt ? "white" : "var(--funkia-ink)",
                    }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Uppdragstyp (multi-select chips) */}
            {requestStep === 2 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {["Landskapsarkitektur", "Dagvatten", "Förvaltning", "Nyanläggning", "Besiktning", "Rådgivning"].map(opt => (
                  <button key={opt}
                    onClick={() => toggleUppdrag(opt)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border"
                    style={{
                      backgroundColor: formData.uppdrag.includes(opt) ? "var(--funkia-moss)" : "white",
                      borderColor: formData.uppdrag.includes(opt) ? "var(--funkia-moss)" : "var(--funkia-sand)",
                      color: formData.uppdrag.includes(opt) ? "white" : "var(--funkia-ink)",
                    }}>
                    {formData.uppdrag.includes(opt) && <span className="mr-1">✓</span>}
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Projektskede */}
            {requestStep === 3 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["Idé", "Tidigt skede", "Pågående projekt", "Befintlig anläggning"].map(opt => (
                  <button key={opt}
                    onClick={() => updateForm("skede", opt)}
                    className="p-3 rounded-xl border text-sm text-center transition-all duration-200"
                    style={{
                      backgroundColor: formData.skede === opt ? "var(--funkia-moss)" : "var(--funkia-cream)",
                      borderColor: formData.skede === opt ? "var(--funkia-moss)" : "var(--funkia-sand)",
                      color: formData.skede === opt ? "white" : "var(--funkia-ink)",
                    }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Ort */}
            {requestStep === 4 && (
              <div className="mt-2">
                <input type="text" value={formData.plats}
                  onChange={e => updateForm("plats", e.target.value)}
                  placeholder="T.ex. Stockholm, Södertälje..."
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2"
                  style={{
                    borderColor: "var(--funkia-sand)",
                    backgroundColor: "white",
                    color: "var(--funkia-ink)",
                    "--tw-ring-color": "var(--funkia-sage)",
                  }} />
              </div>
            )}

            {/* Step 5: Beskrivning */}
            {requestStep === 5 && (
              <div className="mt-2">
                <textarea value={formData.beskrivning}
                  onChange={e => { if (e.target.value.length <= 500) updateForm("beskrivning", e.target.value); }}
                  placeholder="Beskriv ert projekt..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all duration-200 focus:ring-2"
                  style={{
                    borderColor: "var(--funkia-sand)",
                    backgroundColor: "white",
                    color: "var(--funkia-ink)",
                    "--tw-ring-color": "var(--funkia-sage)",
                  }} />
                <p className="text-xs text-right mt-1" style={{ color: "var(--funkia-sage)" }}>
                  {formData.beskrivning.length}/500
                </p>
              </div>
            )}

            {/* Step 6: Kontakt */}
            {requestStep === 6 && (
              <div className="flex flex-col gap-3 mt-2">
                {[
                  { key: "namn", label: "Namn *", type: "text", placeholder: "Ditt namn" },
                  { key: "företag", label: "Företag / BRF", type: "text", placeholder: "Organisation (valfritt)" },
                  { key: "epost", label: "E-post *", type: "email", placeholder: "namn@exempel.se" },
                  { key: "telefon", label: "Telefon *", type: "tel", placeholder: "070-123 45 67" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--funkia-ink)" }}>
                      {field.label}
                    </label>
                    <input type={field.type} value={formData[field.key]}
                      onChange={e => updateForm(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2"
                      style={{
                        borderColor: errors[field.key] ? "#EF4444" : "var(--funkia-sand)",
                        backgroundColor: "white",
                        color: "var(--funkia-ink)",
                        "--tw-ring-color": errors[field.key] ? "#EF4444" : "var(--funkia-sage)",
                      }} />
                    {errors[field.key] && (
                      <p className="text-xs mt-1" style={{ color: "#EF4444" }}>{errors[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 7: Summary */}
            {requestStep === 7 && (
              <div className="mt-2 flex flex-col gap-3">
                {[
                  { label: "Beställartyp", value: formData.beställartyp, step: 1 },
                  { label: "Uppdragstyper", value: formData.uppdrag.join(", "), step: 2 },
                  { label: "Projektskede", value: formData.skede, step: 3 },
                  { label: "Ort", value: formData.plats, step: 4 },
                  { label: "Beskrivning", value: formData.beskrivning, step: 5 },
                  { label: "Kontakt", value: `${formData.namn}${formData.företag ? `, ${formData.företag}` : ""}\n${formData.epost}\n${formData.telefon}`, step: 6 },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl border" style={{ backgroundColor: "var(--funkia-cream)", borderColor: "var(--funkia-sand)" }}>
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-medium" style={{ color: "var(--funkia-sage)" }}>{item.label}</p>
                      <button onClick={() => setRequestStep(item.step)}
                        className="text-xs underline" style={{ color: "var(--funkia-terra)" }}>
                        Ändra
                      </button>
                    </div>
                    <p className="text-sm mt-1 whitespace-pre-line" style={{ color: "var(--funkia-ink)" }}>{item.value}</p>
                  </div>
                ))}

                <button onClick={handleSubmit}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 mt-1"
                  style={{ backgroundColor: "var(--funkia-terra)" }}>
                  Skicka förfrågan →
                </button>
              </div>
            )}

            {/* Next button (steps 1-6) */}
            {requestStep < 7 && (
              <button onClick={handleNext}
                disabled={!isStepValid()}
                className="w-full py-3 rounded-xl text-sm font-medium text-white mt-4 transition-all duration-200"
                style={{
                  backgroundColor: isStepValid() ? "var(--funkia-moss)" : "var(--funkia-sand)",
                  color: isStepValid() ? "white" : "#9CA3AF",
                  cursor: isStepValid() ? "pointer" : "not-allowed",
                }}>
                Nästa →
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderDone = () => (
    <div className="px-4 py-6 flex flex-col items-center text-center">
      {/* Animated checkmark */}
      <div className="mb-4">
        <svg width="72" height="72" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="25" fill="none" stroke="var(--funkia-moss)" strokeWidth="2"
            className="funkia-check-circle" />
          <path d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none" stroke="var(--funkia-moss)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" className="funkia-check-mark" />
        </svg>
      </div>

      <h3 className="font-serif-funkia text-xl font-semibold mb-2" style={{ color: "var(--funkia-ink)" }}>
        Tack {formData.namn}! 🌱
      </h3>
      <p className="text-sm mb-1" style={{ color: "#6B7B6A" }}>
        Vi hör av oss inom 24h
      </p>
      <p className="text-xs px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: "var(--funkia-cream)", color: "var(--funkia-sage)" }}>
        Referens: {referenceId}
      </p>

      {/* Timeline: Vad händer nu? */}
      <div className="w-full text-left mb-6">
        <p className="text-sm font-medium mb-3" style={{ color: "var(--funkia-ink)" }}>Vad händer nu?</p>
        {[
          "Vi granskar din förfrågan",
          "Rätt specialist kontaktar dig",
          "Ni planerar projektet tillsammans",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                style={{ backgroundColor: "var(--funkia-moss)" }}>
                {i + 1}
              </div>
              {i < 2 && <div className="w-0.5 h-4 mt-1" style={{ backgroundColor: "var(--funkia-sand)" }} />}
            </div>
            <p className="text-sm pt-1" style={{ color: "var(--funkia-ink)" }}>{step}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 w-full">
        <button onClick={closeWidget}
          className="flex-1 py-3 rounded-xl text-sm font-medium border transition-all duration-200"
          style={{ borderColor: "var(--funkia-sand)", color: "var(--funkia-moss)" }}>
          Stäng
        </button>
        <button onClick={() => { resetWidget(); }}
          className="flex-1 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200"
          style={{ backgroundColor: "var(--funkia-moss)" }}>
          Ställ ny fråga
        </button>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="px-4 py-3">
      {showTyping && <TypingIndicator />}
      {samVisible && <SamBubble text="Här hittar ni oss!" />}
      {cardsVisible && (
        <div className="flex flex-col gap-3 mt-2" style={{ animation: "funkia-card-in 300ms ease-out forwards" }}>
          {/* Stockholm */}
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--funkia-cream)", borderColor: "var(--funkia-sand)" }}>
            <p className="font-medium text-sm mb-2" style={{ color: "var(--funkia-ink)" }}>Stockholm</p>
            <div className="flex items-start gap-2 mb-1.5">
              <PinIcon size={15} color="var(--funkia-sage)" className="flex-shrink-0 mt-0.5" />
              <p className="text-xs" style={{ color: "#6B7B6A" }}>Ringvägen 100, 118 60 Stockholm</p>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <PhoneIcon size={15} color="var(--funkia-sage)" className="flex-shrink-0" />
              <p className="text-xs" style={{ color: "#6B7B6A" }}>08-669 39 06</p>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon size={15} color="var(--funkia-sage)" className="flex-shrink-0" />
              <p className="text-xs" style={{ color: "#6B7B6A" }}>info@funkia.se</p>
            </div>
          </div>

          {/* Linköping */}
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--funkia-cream)", borderColor: "var(--funkia-sand)" }}>
            <p className="font-medium text-sm mb-2" style={{ color: "var(--funkia-ink)" }}>Linköping</p>
            <div className="flex items-start gap-2 mb-1.5">
              <PinIcon size={15} color="var(--funkia-sage)" className="flex-shrink-0 mt-0.5" />
              <p className="text-xs" style={{ color: "#6B7B6A" }}>Storgatan 20, 582 23 Linköping</p>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon size={15} color="var(--funkia-sage)" className="flex-shrink-0" />
              <p className="text-xs" style={{ color: "#6B7B6A" }}>013-31 10 80</p>
            </div>
          </div>

          {/* Öppettider */}
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--funkia-cream)", borderColor: "var(--funkia-sand)" }}>
            <div className="flex items-center gap-2">
              <ClockIcon size={15} color="var(--funkia-sage)" className="flex-shrink-0" />
              <div>
                <p className="font-medium text-sm" style={{ color: "var(--funkia-ink)" }}>Öppettider</p>
                <p className="text-xs" style={{ color: "#6B7B6A" }}>Måndag–Fredag 08:00–17:00</p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="h-32 rounded-xl flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: "#E5E1D8", border: "1px solid var(--funkia-sand)" }}>
            <PinIcon size={28} color="var(--funkia-sage)" />
            <p className="text-xs font-medium" style={{ color: "var(--funkia-sage)" }}>Stockholm</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderScreen = () => {
    switch (screen) {
      case "home": return renderHome();
      case "brf": return renderBrf();
      case "kommun": return renderKommun();
      case "request": return renderRequest();
      case "done": return renderDone();
      case "contact": return renderContact();
      default: return renderHome();
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="font-body-funkia" style={{ minHeight: "100vh", backgroundColor: "var(--funkia-mist)" }}>
      {/* ─── MOCK WEBSITE ─── */}
      <MockWebsite mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* ─── DEMO HINT TOOLTIP ─── */}
      {!hasOpenedOnce && buttonVisible && !isOpen && (
        <div className="fixed z-[9998] right-6 bottom-[104px] flex flex-col items-end"
          style={{ animation: "funkia-hint-bounce 2s ease-in-out infinite" }}>
          <div className="px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium whitespace-nowrap"
            style={{ backgroundColor: "white", color: "var(--funkia-ink)", border: "1px solid var(--funkia-sand)" }}>
            Prova vår AI-guide ✨
          </div>
          <svg width="16" height="10" viewBox="0 0 16 10" className="mr-6 -mt-0.5">
            <path d="M0 0 L8 10 L16 0" fill="white" />
          </svg>
        </div>
      )}

      {/* ─── FLOATING BUTTON ─── */}
      <div className="fixed z-[9999] bottom-6 right-6">
        {/* Ping rings */}
        {!isOpen && buttonVisible && (
          <>
            <span className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "var(--funkia-moss)", opacity: 0, animation: "funkia-ping 2s ease-out infinite" }} />
            <span className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "var(--funkia-moss)", opacity: 0, animation: "funkia-ping 2s ease-out 600ms infinite" }} />
          </>
        )}

        <button onClick={() => isOpen ? closeWidget() : openWidget()}
          className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #2F4A3A 0%, #3D5E4B 100%)",
            opacity: buttonVisible ? 1 : 0,
            transition: "opacity 600ms ease-out, transform 300ms ease-out",
          }}>
          <div style={{ transition: "transform 300ms ease-out", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
            {isOpen
              ? <CloseIcon size={24} color="white" />
              : <LeafIcon size={28} color="white" />
            }
          </div>

          {/* Notification badge */}
          {!isOpen && !hasOpenedOnce && buttonVisible && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: "#EF4444" }}>
              1
            </span>
          )}
        </button>
      </div>

      {/* ─── WIDGET PANEL ─── */}
      {isOpen && (
        <div className="funkia-panel-enter fixed z-[9998] sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[620px] sm:rounded-3xl
          bottom-0 right-0 w-full h-full sm:max-h-[620px]
          flex flex-col overflow-hidden shadow-2xl"
          style={{ backgroundColor: "var(--funkia-mist)" }}>

          {/* ─── HEADER ─── */}
          <div className="relative flex items-center px-4 py-4 flex-shrink-0"
            style={{ backgroundColor: "var(--funkia-moss)", minHeight: "72px" }}>
            {/* Decorative leaf silhouettes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <svg className="absolute -right-4 -top-4 opacity-[0.08]" width="120" height="120" viewBox="0 0 24 24" fill="white" stroke="none">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5C7 21 9 22 12 22c5.5 0 10-4.5 10-10" />
              </svg>
              <svg className="absolute -left-6 bottom-0 opacity-[0.08] rotate-45" width="80" height="80" viewBox="0 0 24 24" fill="white" stroke="none">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5C7 21 9 22 12 22c5.5 0 10-4.5 10-10" />
              </svg>
            </div>

            {/* Left: Back button */}
            <div className="w-9 flex-shrink-0">
              {showBack && (
                <button onClick={goBack}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-white/10">
                  <ChevronLeftIcon size={20} color="white" />
                </button>
              )}
            </div>

            {/* Center: Avatar + Name */}
            <div className="flex-1 flex items-center justify-center gap-2 relative z-10">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--funkia-sand)" }}>
                <LeafIcon size={18} color="var(--funkia-moss)" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Sam</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-xs text-white/70">Online nu</span>
                </div>
              </div>
            </div>

            {/* Right: Phone + Close */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => navigateTo("contact")}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-white/10">
                <PhoneIcon size={18} color="white" />
              </button>
              <button onClick={closeWidget}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-white/10">
                <CloseIcon size={18} color="white" />
              </button>
            </div>
          </div>

          {/* ─── SCROLLABLE CONTENT ─── */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto funkia-scroll">
            {renderScreen()}
          </div>

          {/* ─── FOOTER ─── */}
          <div className="flex-shrink-0 py-2.5 flex items-center justify-center border-t"
            style={{ backgroundColor: "white", borderColor: "var(--funkia-sand)" }}>
            <div className="flex items-center gap-1.5 opacity-55">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--funkia-moss)" }} />
              <span className="text-xs" style={{ color: "var(--funkia-ink)" }}>Drivs av Samify</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOCK WEBSITE (background page)
   ═══════════════════════════════════════════════════════════════ */
function MockWebsite({ mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <div className="font-body-funkia">
      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{ backgroundColor: "rgba(245, 241, 232, 0.92)", borderColor: "var(--funkia-sand)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <LeafIcon size={24} color="var(--funkia-moss)" />
            <span className="font-serif-funkia text-xl font-bold" style={{ color: "var(--funkia-moss)" }}>Funkia</span>
          </div>
          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-8">
            {["Projekt", "Tjänster", "Om oss", "Kontakt"].map(link => (
              <a key={link} href="#" className="text-sm font-medium transition-colors duration-200 hover:opacity-70"
                style={{ color: "var(--funkia-ink)" }}>
                {link}
              </a>
            ))}
          </div>
          {/* Mobile hamburger */}
          <button className="sm:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <MenuIcon size={24} color="var(--funkia-ink)" />
          </button>
        </div>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t px-6 py-4 flex flex-col gap-3"
            style={{ borderColor: "var(--funkia-sand)", backgroundColor: "var(--funkia-cream)" }}>
            {["Projekt", "Tjänster", "Om oss", "Kontakt"].map(link => (
              <a key={link} href="#" className="text-sm font-medium py-1" style={{ color: "var(--funkia-ink)" }}>
                {link}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden" style={{ minHeight: "520px" }}>
        {/* Background gradient */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #2F4A3A 0%, #4A7056 50%, #A8BAA0 100%)" }} />

        {/* Decorative leaf shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute top-10 left-10 opacity-[0.07]" width="300" height="300" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5C7 21 9 22 12 22c5.5 0 10-4.5 10-10" />
          </svg>
          <svg className="absolute bottom-0 right-0 opacity-[0.05] rotate-180" width="400" height="400" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5C7 21 9 22 12 22c5.5 0 10-4.5 10-10" />
          </svg>
          <svg className="absolute top-1/2 right-1/4 opacity-[0.04] -rotate-45" width="200" height="200" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5C7 21 9 22 12 22c5.5 0 10-4.5 10-10" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32 flex flex-col items-start justify-center" style={{ minHeight: "520px" }}>
          <h1 className="font-serif-funkia text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl mb-6">
            Livsmiljöer för framtidens hållbara samhälle
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-xl mb-10 leading-relaxed">
            Funkia är ett landskapsarkitektkontor som skapar gröna miljöer med omsorg om både människor och natur. Sedan 1991 har vi gestaltat parker, bostadsgårdar och stadsrum i hela Sverige.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#tjanster"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "var(--funkia-cream)", color: "var(--funkia-moss)" }}>
              Våra tjänster
            </a>
            <a href="#kontakt"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold border-2 border-white/40 text-white transition-all duration-200 hover:bg-white/10">
              Kontakta oss
            </a>
          </div>
        </div>
      </section>

      {/* ─── SERVICES SECTION ─── */}
      <section id="tjanster" className="py-20 sm:py-24" style={{ backgroundColor: "var(--funkia-cream)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif-funkia text-3xl sm:text-4xl font-bold text-center mb-4" style={{ color: "var(--funkia-ink)" }}>
            Våra tjänster
          </h2>
          <p className="text-center text-sm mb-12 max-w-lg mx-auto" style={{ color: "#6B7B6A" }}>
            Vi erbjuder helhetslösningar inom landskapsarkitektur, dagvattenhantering och förvaltning av utemiljöer.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                emoji: "🌿",
                title: "Landskapsarkitektur",
                desc: "Gestaltning av parker, torg, bostadsgårdar och offentliga miljöer med fokus på hållbarhet och biologisk mångfald.",
              },
              {
                emoji: "💧",
                title: "Dagvatten",
                desc: "Systemlösningar för hållbar dagvattenhantering. Blågrön infrastruktur som skapar mervärde för staden.",
              },
              {
                emoji: "🌳",
                title: "Förvaltning",
                desc: "Skötselplaner, besiktningar och löpande rådgivning. Vi hjälper er att förvalta och utveckla era gröna miljöer.",
              },
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-2xl border transition-shadow duration-300 hover:shadow-md"
                style={{ backgroundColor: "white", borderColor: "var(--funkia-sand)" }}>
                <div className="text-3xl mb-4">{service.emoji}</div>
                <h3 className="font-serif-funkia text-xl font-semibold mb-3" style={{ color: "var(--funkia-ink)" }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7B6A" }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section className="py-20 sm:py-24" style={{ background: "linear-gradient(180deg, white 0%, var(--funkia-cream) 100%)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif-funkia text-3xl sm:text-4xl font-bold mb-6" style={{ color: "var(--funkia-ink)" }}>
            Om Funkia
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#4A5B49" }}>
            Funkia grundades 1991 och har sedan dess vuxit till ett av Sveriges mest erfarna landskapsarkitektkontor. Med kontor i Stockholm och Linköping arbetar vi med uppdrag i hela landet — från små bostadsgårdar till stora stadsbyggnadsprojekt.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#4A5B49" }}>
            Vår filosofi bygger på att skapa livsmiljöer som är vackra, hållbara och funktionella. Vi kombinerar kreativ gestaltning med teknisk kompetens inom dagvatten, växtkunskap och ekologi. Resultatet är gröna platser som människor trivs i och naturen mår bra av.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-16" style={{ backgroundColor: "var(--funkia-moss)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <LeafIcon size={22} color="var(--funkia-cream)" />
                <span className="font-serif-funkia text-lg font-bold" style={{ color: "var(--funkia-cream)" }}>Funkia</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--funkia-sage)" }}>
                Landskapsarkitektur med omsorg om människor och natur sedan 1991.
              </p>
            </div>
            {/* Stockholm */}
            <div>
              <p className="font-semibold text-sm mb-3" style={{ color: "var(--funkia-cream)" }}>Stockholm</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--funkia-sage)" }}>
                Ringvägen 100<br />118 60 Stockholm<br />08-669 39 06
              </p>
            </div>
            {/* Linköping */}
            <div>
              <p className="font-semibold text-sm mb-3" style={{ color: "var(--funkia-cream)" }}>Linköping</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--funkia-sage)" }}>
                Storgatan 20<br />582 23 Linköping<br />013-31 10 80
              </p>
            </div>
            {/* Contact */}
            <div>
              <p className="font-semibold text-sm mb-3" style={{ color: "var(--funkia-cream)" }}>Kontakt</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--funkia-sage)" }}>
                info@funkia.se<br />Måndag–Fredag<br />08:00–17:00
              </p>
            </div>
          </div>
          <div className="border-t pt-6" style={{ borderColor: "rgba(168, 186, 160, 0.2)" }}>
            <p className="text-xs text-center" style={{ color: "var(--funkia-sage)", opacity: 0.6 }}>
              © 2026 Funkia AB. Alla rättigheter förbehållna. — Demo av Samify
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
