/**
 * Funkia AB – Chatbot Widget Demo
 * ================================
 * Single-file React + Tailwind demo för säljpitch.
 * Kör med: npx vite (efter npm create vite / npm i react react-dom lucide-react)
 * eller i valfri React-sandbox.
 *
 * Palett (CSS-variabler):
 *   --funkia-moss:  #2F4A3A
 *   --funkia-sage:  #7A9478
 *   --funkia-cream: #F5F1E8
 *   --funkia-sand:  #D4C5A9
 *   --funkia-terra: #B8734A
 *   --funkia-ink:   #1F2820
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  X,
  Minus,
  Phone,
  Mail,
  MapPin,
  Check,
  Send,
  ArrowRight,
  Menu,
  ChevronDown,
} from "lucide-react";

/* ─────────────────────────────────────────────
   INLINE SVG: Löv-ikon (widget-knapp & avatar)
   ───────────────────────────────────────────── */
const LeafIcon = ({ size = 28, color = "#F5F1E8", className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5C7 21 9 22 12 22c5.5 0 10-4.5 10-10" />
    <path d="M12 2c2 4 3 8 3 12" />
    <path d="M2 12c4-1 8-1 12 0" />
    <path d="M22 2 L12 12" />
    <path d="M16 2c2 0 4 0 6 0c0 2 0 4 0 6" />
  </svg>
);

/* Dekorativa bladsilhuetter (opacity 0.1) för widget-header */
const DecoLeaves = () => (
  <svg
    className="absolute right-2 top-1 opacity-10 pointer-events-none"
    width="80"
    height="50"
    viewBox="0 0 80 50"
    fill="currentColor"
  >
    <ellipse cx="20" cy="25" rx="12" ry="20" transform="rotate(-30 20 25)" />
    <ellipse cx="50" cy="20" rx="10" ry="18" transform="rotate(15 50 20)" />
    <ellipse cx="70" cy="30" rx="8" ry="14" transform="rotate(-10 70 30)" />
  </svg>
);

/* ─────────────────────────────────────────────
   KONSTANTER – copy & konfiguration
   ───────────────────────────────────────────── */

const BESTÄLLARTYPER = [
  "BRF",
  "Privat",
  "Kommun",
  "Byggbolag",
  "Annat",
];

const UPPDRAGSTYPER = [
  "Landskapsarkitektur / gestaltning",
  "Dagvattenlösning",
  "Förvaltning & skötsel",
  "Nyanläggning",
  "Besiktning / analys",
  "Osäker – vill ha rådgivning",
];

const PROJEKTSKEDEN = [
  "Idé",
  "Tidigt skede",
  "Pågående projekt",
  "Befintlig anläggning",
];

/* Info om Funkias erbjudande per segment */
const SEGMENT_INFO = {
  brf: {
    title: "För BRF:er & privata beställare",
    description:
      "Vi hjälper dig att förvandla din utemiljö till en plats där livet vill vara. Oavsett om det gäller en innergård, villaträdgård eller bostadsområde – vi skapar gestaltningar som förenar funktion, estetik och biologisk mångfald.",
    services: [
      {
        name: "Landskapsarkitektur",
        desc: "Gestaltning av gårdar, trädgårdar och bostadsmiljöer",
      },
      {
        name: "Dagvatten",
        desc: "Hållbar dagvattenhantering som blir en tillgång i utemiljön",
      },
      {
        name: "Förvaltning",
        desc: "Skötselplaner och besiktning av befintliga anläggningar",
      },
    ],
  },
  kommun: {
    title: "För kommuner & byggbolag",
    description:
      "Funkia är en erfaren partner i komplexa stadsutvecklingsprojekt. Vi bidrar med landskapsarkitektur, dagvattenutredningar och gestaltningsprogram som möter höga krav på hållbarhet och inkludering.",
    services: [
      {
        name: "Landskapsarkitektur",
        desc: "Stadsrum, parker, torg och allmänna platser",
      },
      {
        name: "Dagvatten",
        desc: "Systemlösningar, LOD och blågrön infrastruktur",
      },
      {
        name: "Förvaltning",
        desc: "Drift- och underhållsplaner, besiktning och analys",
      },
    ],
  },
};

/* ─────────────────────────────────────────────
   GLOBAL STYLES (injiceras en gång)
   ───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

  :root {
    --funkia-moss:  #2F4A3A;
    --funkia-sage:  #7A9478;
    --funkia-cream: #F5F1E8;
    --funkia-sand:  #D4C5A9;
    --funkia-terra: #B8734A;
    --funkia-ink:   #1F2820;
  }

  .font-serif-display {
    font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  }
  .font-body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  /* Widget öppnings-animation */
  @keyframes widgetOpen {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes widgetClose {
    from { opacity: 1; transform: scale(1) translateY(0); }
    to   { opacity: 0; transform: scale(0.9) translateY(20px); }
  }
  .widget-enter { animation: widgetOpen 400ms cubic-bezier(0.16,1,0.3,1) forwards; }
  .widget-exit  { animation: widgetClose 300ms ease-in forwards; }

  /* Pulsering för widget-knapp */
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: 0.6; }
    70%  { transform: scale(1.5); opacity: 0; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  .pulse-ring::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: var(--funkia-moss);
    animation: pulse-ring 2s ease-out infinite;
    z-index: -1;
  }

  /* Meddelande-animation */
  @keyframes msgSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .msg-enter { animation: msgSlideIn 350ms ease-out forwards; }

  /* Knapp hover-lift */
  .hover-lift {
    transition: transform 200ms ease, box-shadow 200ms ease;
  }
  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(47,74,58,0.15);
  }

  /* Scrollbar */
  .widget-scroll::-webkit-scrollbar { width: 4px; }
  .widget-scroll::-webkit-scrollbar-track { background: transparent; }
  .widget-scroll::-webkit-scrollbar-thumb {
    background: var(--funkia-sand);
    border-radius: 4px;
  }
`;

/* ─────────────────────────────────────────────
   HJÄLPFUNKTIONER
   ───────────────────────────────────────────── */
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* ─────────────────────────────────────────────
   WIDGET-KOMPONENTER
   ───────────────────────────────────────────── */

/* Sam-meddelande (vänster) */
function SamMessage({ text, children }) {
  return (
    <div className="msg-enter flex items-start gap-2 mb-4">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: "var(--funkia-sage)" }}
      >
        <LeafIcon size={16} color="var(--funkia-cream)" />
      </div>
      <div
        className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
        style={{
          background: "rgba(122,148,120,0.15)",
          color: "var(--funkia-ink)",
        }}
      >
        {text && <p className="whitespace-pre-line">{text}</p>}
        {children}
      </div>
    </div>
  );
}

/* Användarens val (höger) */
function UserMessage({ text }) {
  return (
    <div className="msg-enter flex justify-end mb-4">
      <div
        className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed text-white"
        style={{ background: "var(--funkia-moss)" }}
      >
        <p>{text}</p>
      </div>
    </div>
  );
}

/* Val-kort (under Sams meddelande) */
function ChoiceCard({ label, subtitle, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="hover-lift w-full text-left px-4 py-3 rounded-xl border transition-colors duration-200 mb-2 cursor-pointer"
      style={{
        borderColor: "var(--funkia-sand)",
        background: "white",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--funkia-sage)";
        e.currentTarget.style.background = "rgba(122,148,120,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--funkia-sand)";
        e.currentTarget.style.background = "white";
      }}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="text-lg flex-shrink-0">{icon}</span>
        )}
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--funkia-moss)" }}
          >
            {label}
          </p>
          {subtitle && (
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--funkia-sage)" }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <ArrowRight
          size={14}
          className="ml-auto flex-shrink-0"
          style={{ color: "var(--funkia-sand)" }}
        />
      </div>
    </button>
  );
}

/* Progress-indikator */
function ProgressBar({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      <span
        className="text-xs font-medium"
        style={{ color: "var(--funkia-sage)" }}
      >
        {step}/{total}
      </span>
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ background: "var(--funkia-sand)", opacity: 0.4 }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${(step / total) * 100}%`,
            background: "var(--funkia-sage)",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WIDGET – Huvudkomponent
   ───────────────────────────────────────────── */
function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  // Navigerings-state
  // screen: "welcome" | "segment-brf" | "segment-kommun" | "inquiry" | "confirmation"
  const [screen, setScreen] = useState("welcome");
  const [history, setHistory] = useState([]);

  // Projektförfrågan state
  const [inquiryStep, setInquiryStep] = useState(1);
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

  // Meddelanden (Sam + användare)
  const [messages, setMessages] = useState([]);

  const scrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, screen, inquiryStep]);

  // Pulsering efter 5s om inte öppnad
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowPulse(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsClosing(false);
    setShowPulse(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const navigateTo = useCallback(
    (newScreen) => {
      setHistory((h) => [...h, { screen, inquiryStep }]);
      setScreen(newScreen);
      if (newScreen === "inquiry") setInquiryStep(1);
    },
    [screen, inquiryStep]
  );

  const goBack = () => {
    if (screen === "inquiry" && inquiryStep > 1) {
      setInquiryStep((s) => s - 1);
      setErrors({});
      return;
    }
    const prev = history[history.length - 1];
    if (prev) {
      setHistory((h) => h.slice(0, -1));
      setScreen(prev.screen);
      setInquiryStep(prev.inquiryStep);
      setErrors({});
    }
  };

  const resetWidget = () => {
    setScreen("welcome");
    setHistory([]);
    setInquiryStep(1);
    setFormData({
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
    setMessages([]);
    setErrors({});
  };

  const addMessage = (sender, text) => {
    setMessages((m) => [...m, { sender, text, id: Date.now() }]);
  };

  const handlePrimaryChoice = (choice) => {
    if (choice === 1) {
      addMessage("user", "Jag representerar en BRF eller privat beställare");
      navigateTo("segment-brf");
    } else if (choice === 2) {
      addMessage("user", "Jag representerar kommun eller byggbolag");
      navigateTo("segment-kommun");
    } else {
      addMessage("user", "Jag vill starta en projektförfrågan");
      navigateTo("inquiry");
    }
  };

  /* ── Projektförfrågan: validering & submit ── */
  const validateInquiryStep = () => {
    const e = {};
    switch (inquiryStep) {
      case 1:
        if (!formData.beställartyp) e.beställartyp = "Välj typ av beställare";
        break;
      case 2:
        if (formData.uppdrag.length === 0) e.uppdrag = "Välj minst ett uppdrag";
        break;
      case 3:
        if (!formData.skede) e.skede = "Välj projektskede";
        break;
      case 4:
        if (!formData.plats.trim()) e.plats = "Ange ort eller plats";
        break;
      case 5:
        if (!formData.beskrivning.trim())
          e.beskrivning = "Beskriv kort ditt projekt";
        break;
      case 6:
        if (!formData.namn.trim()) e.namn = "Ange ditt namn";
        if (!formData.epost.trim()) e.epost = "Ange e-postadress";
        else if (!isValidEmail(formData.epost))
          e.epost = "Ogiltig e-postadress";
        break;
      default:
        break;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextInquiryStep = () => {
    if (!validateInquiryStep()) return;
    if (inquiryStep < 7) {
      setInquiryStep((s) => s + 1);
      setErrors({});
    }
  };

  const submitInquiry = () => {
    /*
     * ═══════════════════════════════════════════════
     * 🔌 AUTOFLOW WEBHOOK – Anslut här
     * ═══════════════════════════════════════════════
     * Ersätt console.log nedan med ett fetch()-anrop
     * till Samify Autoflow webhook-endpoint, t.ex:
     *
     * fetch("https://autoflow.samify.se/webhook/funkia", {
     *   method: "POST",
     *   headers: { "Content-Type": "application/json" },
     *   body: JSON.stringify(payload),
     * });
     * ═══════════════════════════════════════════════
     */
    const payload = {
      source: "funkia-widget",
      timestamp: new Date().toISOString(),
      contact: {
        namn: formData.namn,
        företag: formData.företag,
        epost: formData.epost,
        telefon: formData.telefon,
      },
      project: {
        beställartyp: formData.beställartyp,
        uppdrag: formData.uppdrag,
        skede: formData.skede,
        plats: formData.plats,
        beskrivning: formData.beskrivning,
      },
    };

    console.log("═══ FUNKIA PROJEKTFÖRFRÅGAN ═══");
    console.log(JSON.stringify(payload, null, 2));
    console.log("═══════════════════════════════");

    setScreen("confirmation");
  };

  const toggleUppdrag = (val) => {
    setFormData((f) => ({
      ...f,
      uppdrag: f.uppdrag.includes(val)
        ? f.uppdrag.filter((v) => v !== val)
        : [...f.uppdrag, val],
    }));
    setErrors((e) => ({ ...e, uppdrag: undefined }));
  };

  /* ── Renderare per inquiry-steg ── */
  const renderInquiryStep = () => {
    switch (inquiryStep) {
      case 1:
        return (
          <div className="msg-enter">
            <SamMessage text="Vilken typ av beställare är du?" />
            <div className="ml-10 space-y-2">
              {BESTÄLLARTYPER.map((typ) => (
                <button
                  key={typ}
                  onClick={() => {
                    setFormData((f) => ({ ...f, beställartyp: typ }));
                    setErrors((e) => ({ ...e, beställartyp: undefined }));
                  }}
                  className="hover-lift w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor:
                      formData.beställartyp === typ
                        ? "var(--funkia-moss)"
                        : "var(--funkia-sand)",
                    background:
                      formData.beställartyp === typ
                        ? "rgba(47,74,58,0.08)"
                        : "white",
                    color: "var(--funkia-ink)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor:
                          formData.beställartyp === typ
                            ? "var(--funkia-moss)"
                            : "var(--funkia-sand)",
                      }}
                    >
                      {formData.beställartyp === typ && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: "var(--funkia-moss)" }}
                        />
                      )}
                    </div>
                    {typ}
                  </div>
                </button>
              ))}
              {errors.beställartyp && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.beställartyp}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="msg-enter">
            <SamMessage text="Vilka typer av uppdrag är du intresserad av? Du kan välja flera." />
            <div className="ml-10 space-y-2">
              {UPPDRAGSTYPER.map((typ) => {
                const selected = formData.uppdrag.includes(typ);
                return (
                  <button
                    key={typ}
                    onClick={() => toggleUppdrag(typ)}
                    className="hover-lift w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: selected
                        ? "var(--funkia-moss)"
                        : "var(--funkia-sand)",
                      background: selected
                        ? "rgba(47,74,58,0.08)"
                        : "white",
                      color: "var(--funkia-ink)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border flex items-center justify-center"
                        style={{
                          borderColor: selected
                            ? "var(--funkia-moss)"
                            : "var(--funkia-sand)",
                          background: selected
                            ? "var(--funkia-moss)"
                            : "transparent",
                        }}
                      >
                        {selected && <Check size={10} color="white" />}
                      </div>
                      {typ}
                    </div>
                  </button>
                );
              })}
              {errors.uppdrag && (
                <p className="text-xs text-red-500 mt-1">{errors.uppdrag}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="msg-enter">
            <SamMessage text="Var befinner sig projektet idag?" />
            <div className="ml-10 space-y-2">
              {PROJEKTSKEDEN.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setFormData((f) => ({ ...f, skede: s }));
                    setErrors((e) => ({ ...e, skede: undefined }));
                  }}
                  className="hover-lift w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor:
                      formData.skede === s
                        ? "var(--funkia-moss)"
                        : "var(--funkia-sand)",
                    background:
                      formData.skede === s
                        ? "rgba(47,74,58,0.08)"
                        : "white",
                    color: "var(--funkia-ink)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor:
                          formData.skede === s
                            ? "var(--funkia-moss)"
                            : "var(--funkia-sand)",
                      }}
                    >
                      {formData.skede === s && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: "var(--funkia-moss)" }}
                        />
                      )}
                    </div>
                    {s}
                  </div>
                </button>
              ))}
              {errors.skede && (
                <p className="text-xs text-red-500 mt-1">{errors.skede}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="msg-enter">
            <SamMessage text="Var finns projektet? Ange ort eller adress." />
            <div className="ml-10">
              <input
                type="text"
                value={formData.plats}
                onChange={(e) => {
                  setFormData((f) => ({ ...f, plats: e.target.value }));
                  setErrors((er) => ({ ...er, plats: undefined }));
                }}
                placeholder="T.ex. Stockholm, Södertälje..."
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors duration-200 font-body"
                style={{
                  borderColor: errors.plats
                    ? "#ef4444"
                    : "var(--funkia-sand)",
                  background: "white",
                  color: "var(--funkia-ink)",
                }}
                onFocus={(e) => {
                  if (!errors.plats)
                    e.target.style.borderColor = "var(--funkia-sage)";
                }}
                onBlur={(e) => {
                  if (!errors.plats)
                    e.target.style.borderColor = "var(--funkia-sand)";
                }}
              />
              {errors.plats && (
                <p className="text-xs text-red-500 mt-1">{errors.plats}</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="msg-enter">
            <SamMessage text="Berätta kort om projektet. Vad vill ni uppnå?" />
            <div className="ml-10">
              <textarea
                value={formData.beskrivning}
                onChange={(e) => {
                  setFormData((f) => ({
                    ...f,
                    beskrivning: e.target.value,
                  }));
                  setErrors((er) => ({ ...er, beskrivning: undefined }));
                }}
                placeholder="Beskriv era tankar och önskemål..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors duration-200 resize-none font-body"
                style={{
                  borderColor: errors.beskrivning
                    ? "#ef4444"
                    : "var(--funkia-sand)",
                  background: "white",
                  color: "var(--funkia-ink)",
                }}
                onFocus={(e) => {
                  if (!errors.beskrivning)
                    e.target.style.borderColor = "var(--funkia-sage)";
                }}
                onBlur={(e) => {
                  if (!errors.beskrivning)
                    e.target.style.borderColor = "var(--funkia-sand)";
                }}
              />
              {errors.beskrivning && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.beskrivning}
                </p>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="msg-enter">
            <SamMessage text="Vem kan vi kontakta angående projektet?" />
            <div className="ml-10 space-y-3">
              {[
                {
                  key: "namn",
                  label: "Namn *",
                  type: "text",
                  placeholder: "Ditt namn",
                },
                {
                  key: "företag",
                  label: "Företag / BRF",
                  type: "text",
                  placeholder: "Organisation (valfritt)",
                },
                {
                  key: "epost",
                  label: "E-post *",
                  type: "email",
                  placeholder: "din@epost.se",
                },
                {
                  key: "telefon",
                  label: "Telefon",
                  type: "tel",
                  placeholder: "070-000 00 00 (valfritt)",
                },
              ].map((field) => (
                <div key={field.key}>
                  <label
                    className="text-xs font-medium mb-1 block"
                    style={{ color: "var(--funkia-sage)" }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.key]}
                    onChange={(e) => {
                      setFormData((f) => ({
                        ...f,
                        [field.key]: e.target.value,
                      }));
                      setErrors((er) => ({
                        ...er,
                        [field.key]: undefined,
                      }));
                    }}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 font-body"
                    style={{
                      borderColor: errors[field.key]
                        ? "#ef4444"
                        : "var(--funkia-sand)",
                      background: "white",
                      color: "var(--funkia-ink)",
                    }}
                    onFocus={(e) => {
                      if (!errors[field.key])
                        e.target.style.borderColor = "var(--funkia-sage)";
                    }}
                    onBlur={(e) => {
                      if (!errors[field.key])
                        e.target.style.borderColor = "var(--funkia-sand)";
                    }}
                  />
                  {errors[field.key] && (
                    <p className="text-xs text-red-500 mt-0.5">
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="msg-enter">
            <SamMessage text="Här är en sammanfattning av din förfrågan. Ser allt rätt ut?" />
            <div
              className="ml-10 rounded-xl p-4 text-sm space-y-2"
              style={{
                background: "rgba(122,148,120,0.08)",
                color: "var(--funkia-ink)",
              }}
            >
              <div>
                <span className="font-medium" style={{ color: "var(--funkia-sage)" }}>
                  Beställartyp:
                </span>{" "}
                {formData.beställartyp}
              </div>
              <div>
                <span className="font-medium" style={{ color: "var(--funkia-sage)" }}>
                  Uppdrag:
                </span>{" "}
                {formData.uppdrag.join(", ")}
              </div>
              <div>
                <span className="font-medium" style={{ color: "var(--funkia-sage)" }}>
                  Skede:
                </span>{" "}
                {formData.skede}
              </div>
              <div>
                <span className="font-medium" style={{ color: "var(--funkia-sage)" }}>
                  Plats:
                </span>{" "}
                {formData.plats}
              </div>
              <div>
                <span className="font-medium" style={{ color: "var(--funkia-sage)" }}>
                  Beskrivning:
                </span>{" "}
                {formData.beskrivning}
              </div>
              <hr style={{ borderColor: "var(--funkia-sand)", opacity: 0.4 }} />
              <div>
                <span className="font-medium" style={{ color: "var(--funkia-sage)" }}>
                  Kontakt:
                </span>{" "}
                {formData.namn}
                {formData.företag && ` – ${formData.företag}`}
              </div>
              <div>{formData.epost}</div>
              {formData.telefon && <div>{formData.telefon}</div>}
            </div>
            <div className="ml-10 mt-3">
              <button
                onClick={submitInquiry}
                className="hover-lift w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 cursor-pointer"
                style={{ background: "var(--funkia-terra)" }}
              >
                <Send size={14} />
                Skicka förfrågan
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ── Segment-vy (routing) ── */
  const renderSegment = (key) => {
    const info = SEGMENT_INFO[key];
    return (
      <div className="msg-enter">
        <SamMessage>
          <p className="font-medium mb-2" style={{ color: "var(--funkia-moss)" }}>
            {info.title}
          </p>
          <p className="mb-3">{info.description}</p>
        </SamMessage>
        <div className="ml-10 space-y-2 mb-3">
          {info.services.map((svc) => (
            <div
              key={svc.name}
              className="px-4 py-3 rounded-xl border text-sm"
              style={{
                borderColor: "var(--funkia-sand)",
                background: "white",
              }}
            >
              <p
                className="font-medium"
                style={{ color: "var(--funkia-moss)" }}
              >
                {svc.name}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--funkia-sage)" }}
              >
                {svc.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="ml-10 space-y-2">
          <ChoiceCard
            label="Starta projektförfrågan"
            subtitle="Vi guidar dig steg för steg"
            onClick={() => navigateTo("inquiry")}
            icon="📋"
          />
          <ChoiceCard
            label="Kontakta oss direkt"
            subtitle="info@funkia.se / 08-669 39 06"
            onClick={() => {
              addMessage("user", "Jag vill kontakta er direkt");
              addMessage(
                "sam",
                "Självklart! Ni når oss på info@funkia.se eller 08-669 39 06. Vi ser fram emot att höra från er."
              );
            }}
            icon="📞"
          />
        </div>
      </div>
    );
  };

  /* ── Widget-kropp ── */
  const renderBody = () => {
    if (screen === "confirmation") {
      return (
        <div className="msg-enter p-6 text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(122,148,120,0.15)" }}
          >
            <Check size={32} style={{ color: "var(--funkia-moss)" }} />
          </div>
          <h3
            className="font-serif-display text-xl font-semibold mb-2"
            style={{ color: "var(--funkia-moss)" }}
          >
            Tack för din förfrågan! 🌱
          </h3>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--funkia-ink)" }}
          >
            Vi har tagit emot dina uppgifter och återkommer inom 24 timmar.
          </p>
          <button
            onClick={resetWidget}
            className="hover-lift px-4 py-2 rounded-xl border text-sm cursor-pointer transition-all duration-200"
            style={{
              borderColor: "var(--funkia-sand)",
              color: "var(--funkia-moss)",
            }}
          >
            Tillbaka till start
          </button>
        </div>
      );
    }

    return (
      <div className="p-4">
        {/* Renderade meddelanden */}
        {messages.map((msg) =>
          msg.sender === "user" ? (
            <UserMessage key={msg.id} text={msg.text} />
          ) : (
            <SamMessage key={msg.id} text={msg.text} />
          )
        )}

        {/* Välkomstskärm */}
        {screen === "welcome" && (
          <div className="msg-enter">
            <SamMessage text="Hej! Jag är Sam – din guide hos Funkia. 🌿 Vad kan jag hjälpa dig med idag?" />
            <div className="ml-10 space-y-2 mt-1">
              <ChoiceCard
                label="Jag representerar en BRF eller privat beställare"
                subtitle="Bostadsföreningar, villaägare m.fl."
                onClick={() => handlePrimaryChoice(1)}
                icon="🏡"
              />
              <ChoiceCard
                label="Jag representerar kommun eller byggbolag"
                subtitle="Offentlig sektor, exploatörer"
                onClick={() => handlePrimaryChoice(2)}
                icon="🏛️"
              />
              <ChoiceCard
                label="Jag vill starta en projektförfrågan"
                subtitle="Steg-för-steg — tar ungefär 2 minuter"
                onClick={() => handlePrimaryChoice(3)}
                icon="✏️"
              />
            </div>
          </div>
        )}

        {/* Segment-vyer */}
        {screen === "segment-brf" && renderSegment("brf")}
        {screen === "segment-kommun" && renderSegment("kommun")}

        {/* Projektförfrågan */}
        {screen === "inquiry" && (
          <>
            <ProgressBar step={inquiryStep} total={7} />
            {renderInquiryStep()}
            {inquiryStep < 7 && (
              <div className="ml-10 mt-3">
                <button
                  onClick={nextInquiryStep}
                  className="hover-lift flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 cursor-pointer"
                  style={{ background: "var(--funkia-moss)" }}
                >
                  Fortsätt
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ── Flytande knapp ── */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={`fixed bottom-6 right-6 z-50 w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer ${
            showPulse ? "pulse-ring" : ""
          }`}
          style={{ background: "var(--funkia-moss)" }}
          aria-label="Öppna chat"
        >
          <LeafIcon size={28} color="var(--funkia-cream)" />
        </button>
      )}

      {/* ── Expanderad widget ── */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col shadow-2xl overflow-hidden
            ${isClosing ? "widget-exit" : "widget-enter"}
            bottom-0 right-0 w-full h-full
            sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[580px] sm:rounded-3xl`}
          style={{
            background: "var(--funkia-cream)",
            boxShadow: "0 12px 48px rgba(47,74,58,0.18)",
          }}
        >
          {/* Header */}
          <div
            className="relative flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{
              background: "var(--funkia-moss)",
              color: "var(--funkia-cream)",
            }}
          >
            <DecoLeaves />
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(245,241,232,0.15)" }}
            >
              <LeafIcon size={18} color="var(--funkia-cream)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium font-serif-display">
                Sam – Funkia
              </p>
              <p className="text-xs opacity-70">
                Din guide till gröna lösningar
              </p>
            </div>
            <div className="flex items-center gap-1">
              {screen !== "welcome" && screen !== "confirmation" && (
                <button
                  onClick={resetWidget}
                  className="p-1.5 rounded-lg transition-colors duration-200 cursor-pointer opacity-70 hover:opacity-100 text-xs"
                  style={{ color: "var(--funkia-cream)" }}
                  title="Börja om"
                >
                  Börja om
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg transition-colors duration-200 cursor-pointer opacity-70 hover:opacity-100"
                aria-label="Minimera"
              >
                <Minus size={18} />
              </button>
            </div>
          </div>

          {/* Tillbaka-rad */}
          {(screen !== "welcome" && screen !== "confirmation") && (
            <div
              className="flex items-center px-3 py-1.5 border-b flex-shrink-0"
              style={{
                borderColor: "rgba(212,197,169,0.3)",
                background: "rgba(245,241,232,0.5)",
              }}
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-xs cursor-pointer transition-colors duration-200 font-body"
                style={{ color: "var(--funkia-sage)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--funkia-moss)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--funkia-sage)")
                }
              >
                <ChevronLeft size={14} />
                Tillbaka
              </button>
            </div>
          )}

          {/* Chat-area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto widget-scroll"
          >
            {renderBody()}
          </div>

          {/* Footer */}
          <div
            className="text-center py-2 text-xs flex-shrink-0"
            style={{
              color: "var(--funkia-sand)",
              borderTop: "1px solid rgba(212,197,169,0.3)",
            }}
          >
            Drivs av Samify
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   MOCK FUNKIA-HEMSIDA
   ───────────────────────────────────────────── */
function FunkiaMockSite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="font-body" style={{ color: "var(--funkia-ink)" }}>
      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-40 backdrop-blur-md border-b"
        style={{
          background: "rgba(245,241,232,0.92)",
          borderColor: "var(--funkia-sand)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LeafIcon size={24} color="var(--funkia-moss)" />
            <span
              className="font-serif-display text-xl font-bold"
              style={{ color: "var(--funkia-moss)" }}
            >
              Funkia
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["Projekt", "Tjänster", "Om oss", "Kontakt"].map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors duration-200"
                style={{ color: "var(--funkia-ink)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--funkia-moss)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--funkia-ink)")
                }
              >
                {item}
              </a>
            ))}
          </div>
          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={22} style={{ color: "var(--funkia-moss)" }} />
          </button>
        </div>
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t px-4 py-3 space-y-2"
            style={{ borderColor: "var(--funkia-sand)" }}
          >
            {["Projekt", "Tjänster", "Om oss", "Kontakt"].map((item) => (
              <a
                key={item}
                href="#"
                className="block py-1 text-sm"
                style={{ color: "var(--funkia-ink)" }}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--funkia-moss) 0%, #3d5e4a 50%, var(--funkia-sage) 100%)",
          minHeight: "520px",
        }}
      >
        {/* Dekorativa element */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="white">
            <ellipse cx="200" cy="300" rx="180" ry="260" transform="rotate(-20 200 300)" />
            <ellipse cx="900" cy="200" rx="140" ry="220" transform="rotate(15 900 200)" />
            <ellipse cx="600" cy="500" rx="200" ry="120" transform="rotate(-5 600 500)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1
              className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ color: "var(--funkia-cream)" }}
            >
              Livsmiljöer för framtidens hållbara samhälle
            </h1>
            <p
              className="text-lg sm:text-xl leading-relaxed mb-8 opacity-90"
              style={{ color: "var(--funkia-cream)" }}
            >
              Funkia är ett landskapsarkitektkontor som skapar gröna miljöer
              med omsorg om både människor och natur. Sedan 1991 har vi
              gestaltat parker, bostadsgårdar och stadsrum i hela Sverige.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#services"
                className="hover-lift inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: "var(--funkia-cream)",
                  color: "var(--funkia-moss)",
                }}
              >
                Våra tjänster
                <ChevronDown size={16} />
              </a>
              <a
                href="#contact"
                className="hover-lift inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all duration-200"
                style={{
                  borderColor: "rgba(245,241,232,0.4)",
                  color: "var(--funkia-cream)",
                }}
              >
                Kontakta oss
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tjänster ── */}
      <section
        id="services"
        className="py-16 sm:py-24"
        style={{ background: "var(--funkia-cream)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2
              className="font-serif-display text-3xl sm:text-4xl font-semibold mb-3"
              style={{ color: "var(--funkia-moss)" }}
            >
              Våra tjänster
            </h2>
            <p
              className="text-base max-w-xl mx-auto"
              style={{ color: "var(--funkia-sage)" }}
            >
              Vi erbjuder helhetslösningar inom landskapsarkitektur,
              dagvattenhantering och förvaltning av gröna miljöer.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Landskapsarkitektur",
                desc: "Gestaltning av parker, bostadsgårdar, torg och offentliga rum. Vi skapar platser som berikar vardagen och stärker biologisk mångfald.",
                icon: "🌿",
              },
              {
                title: "Dagvatten",
                desc: "Hållbara dagvattenlösningar som integrerar vatten som en resurs i gestaltningen. LOD, regnbäddar, svackdiken och blågrön infrastruktur.",
                icon: "💧",
              },
              {
                title: "Förvaltning",
                desc: "Skötselplaner, besiktningar och kvalitetssäkring av gröna anläggningar. Vi ser till att utemiljöer utvecklas och mår bra över tid.",
                icon: "🌳",
              },
            ].map((svc) => (
              <div
                key={svc.title}
                className="hover-lift p-6 rounded-2xl border transition-all duration-200"
                style={{
                  background: "white",
                  borderColor: "var(--funkia-sand)",
                }}
              >
                <span className="text-3xl">{svc.icon}</span>
                <h3
                  className="font-serif-display text-xl font-semibold mt-4 mb-2"
                  style={{ color: "var(--funkia-moss)" }}
                >
                  {svc.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--funkia-sage)" }}>
                  {svc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Om oss ── */}
      <section
        className="py-16 sm:py-24"
        style={{
          background:
            "linear-gradient(180deg, white 0%, var(--funkia-cream) 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="font-serif-display text-3xl sm:text-4xl font-semibold mb-6"
              style={{ color: "var(--funkia-moss)" }}
            >
              Om Funkia
            </h2>
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "var(--funkia-ink)" }}
            >
              Funkia grundades 1991 och är idag ett av Sveriges ledande
              landskapsarkitektkontor. Med kontor i Stockholm och Linköping
              arbetar vi med uppdrag i hela landet – från intima trädgårdar
              till storskaliga stadsutvecklingsprojekt.
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--funkia-ink)" }}
            >
              Vi tror att en väl gestaltad utemiljö gör skillnad i människors
              liv. Vår drivkraft är att skapa platser där natur och vardagsliv
              möts – hållbart, vackert och funktionellt.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "var(--funkia-moss)", color: "var(--funkia-cream)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LeafIcon size={20} color="var(--funkia-cream)" />
                <span className="font-serif-display text-lg font-bold">
                  Funkia
                </span>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                Landskapsarkitektur med omsorg om framtiden.
              </p>
            </div>

            {/* Stockholm */}
            <div>
              <h4 className="text-sm font-medium mb-3 opacity-90">Stockholm</h4>
              <div className="space-y-1 text-sm opacity-70">
                <p className="flex items-center gap-2">
                  <MapPin size={12} />
                  Ringvägen 100, 118 60 Stockholm
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={12} />
                  08-669 39 06
                </p>
              </div>
            </div>

            {/* Linköping */}
            <div>
              <h4 className="text-sm font-medium mb-3 opacity-90">Linköping</h4>
              <div className="space-y-1 text-sm opacity-70">
                <p className="flex items-center gap-2">
                  <MapPin size={12} />
                  Storgatan 20, 582 23 Linköping
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={12} />
                  013-31 10 80
                </p>
              </div>
            </div>

            {/* Kontakt */}
            <div>
              <h4 className="text-sm font-medium mb-3 opacity-90">Kontakt</h4>
              <div className="space-y-1 text-sm opacity-70">
                <p className="flex items-center gap-2">
                  <Mail size={12} />
                  info@funkia.se
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={12} />
                  08-669 39 06
                </p>
              </div>
            </div>
          </div>

          <div
            className="mt-10 pt-6 border-t text-xs text-center opacity-50"
            style={{ borderColor: "rgba(245,241,232,0.15)" }}
          >
            &copy; {new Date().getFullYear()} Funkia Landskapsarkitektur AB.
            Alla rättigheter förbehållna.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HUVUDKOMPONENT (DEFAULT EXPORT)
   ───────────────────────────────────────────── */
export default function FunkiaWidgetDemo() {
  /* Injicera CSS en gång */
  useEffect(() => {
    const id = "funkia-widget-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{ background: "var(--funkia-cream)" }}>
      <FunkiaMockSite />
      <ChatWidget />
    </div>
  );
}
