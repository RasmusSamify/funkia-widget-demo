/**
 * Funkia AB – Premium Chatbot Widget Demo
 * ========================================
 * Modelled after the Kalmar FF widget pattern:
 * bubble-hint, pulse launcher, multi-screen panel with slide transitions,
 * hero section, tile grid, chat, contact cards.
 *
 * Single-file React component. No lucide-react — all inline SVG.
 * All text in Swedish. No localStorage.
 *
 * Palette (CSS vars):
 *   --f-moss:    #2F4A3A   --f-moss-dk: #1F3328
 *   --f-sage:    #A8BAA0   --f-cream:   #F5F1E8
 *   --f-sand:    #E8DFC8   --f-terra:   #B8734A
 *   --f-ink:     #1F2820   --f-mist:    #FAF8F2
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   CSS — injected once via <style> tag
   ═══════════════════════════════════════════════════════════════ */
const WIDGET_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --f-moss: #2F4A3A; --f-moss-dk: #1F3328; --f-sage: #A8BAA0;
  --f-cream: #F5F1E8; --f-sand: #E8DFC8; --f-terra: #B8734A;
  --f-ink: #1F2820; --f-mist: #FAF8F2; --f-white: #FFFFFF;
  --f-border: #E0D9CB; --f-green: #4A9D6A;
  --f-font: 'Inter', -apple-system, system-ui, sans-serif;
  --f-serif: 'Cormorant Garamond', Georgia, serif;
  --f-r: 16px; --f-r-sm: 10px;
}

/* ── Widget root ── */
.fw-root { position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: var(--f-font); }

/* ── Bubble hint ── */
.fw-bubble {
  position: absolute; bottom: 78px; right: 0;
  background: white; border-radius: 14px 14px 4px 14px;
  padding: 11px 32px 11px 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,.16);
  width: 230px; cursor: pointer;
  animation: fwBubblePop .4s .8s both;
}
.fw-bubble.hidden { opacity: 0; transform: scale(.9); pointer-events: none; transition: all .2s; }
.fw-bubble::after {
  content:''; position: absolute; bottom: -8px; right: 22px;
  width: 0; height: 0;
  border-left: 10px solid transparent; border-top: 9px solid white;
}
@keyframes fwBubblePop { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
.fw-bubble-text { font-size: 13px; font-weight: 500; color: var(--f-moss); line-height: 1.5; }
.fw-bubble-close {
  position: absolute; top: 8px; right: 10px;
  background: none; border: none; color: #C0C0C8; font-size: 12px; cursor: pointer;
}

/* ── Launcher button ── */
.fw-btn {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg, var(--f-moss) 0%, #3d6049 100%);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  box-shadow: 0 4px 24px rgba(47,74,58,.5);
  transition: transform .2s;
}
.fw-btn:hover { transform: scale(1.07); }
.fw-pulse {
  position: absolute; inset: 0; border-radius: 50%;
  background: var(--f-moss); opacity: 0;
  animation: fwPulse 2.8s ease-out infinite;
}
.fw-pulse:nth-child(2) { animation-delay: .9s; }
@keyframes fwPulse { 0%{transform:scale(1);opacity:.45} 100%{transform:scale(2);opacity:0} }
.fw-notif {
  position: absolute; top: -2px; right: -2px;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--f-terra); color: white;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid white;
}
.fw-btn .ic-leaf, .fw-btn .ic-close { transition: transform .3s, opacity .3s; position: absolute; }
.fw-btn.open .ic-leaf { transform: rotate(90deg); opacity: 0; }
.fw-btn.open .ic-close { transform: rotate(0deg); opacity: 1; }
.fw-btn:not(.open) .ic-leaf { transform: rotate(0deg); opacity: 1; }
.fw-btn:not(.open) .ic-close { transform: rotate(-90deg); opacity: 0; }
.fw-btn.open .fw-notif, .fw-btn.open .fw-pulse { display: none; }

/* ── Panel ── */
.fw-panel {
  position: absolute; bottom: 78px; right: 0;
  width: 420px; height: 680px;
  background: var(--f-white); border-radius: 20px;
  box-shadow: 0 8px 60px rgba(0,0,0,.20);
  display: flex; flex-direction: column; overflow: hidden;
  transform: scale(.9) translateY(10px); opacity: 0; pointer-events: none;
  transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .22s;
  transform-origin: bottom right;
}
.fw-panel.visible { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

/* ── Header ── */
.fw-hdr {
  background: var(--f-moss); padding: 16px;
  display: flex; align-items: center; flex-shrink: 0;
  position: relative; border-bottom: 3px solid var(--f-sage);
  overflow: hidden;
}
.fw-hdr-deco {
  position: absolute; right: -10px; top: -20px; width: 120px; height: 120px;
  border-radius: 50%; background: rgba(168,186,160,.08); pointer-events: none;
}
.fw-hdr-back {
  background: none; border: none; color: rgba(255,255,255,.6);
  cursor: pointer; font-size: 24px; padding: 0 8px 0 0;
  font-family: var(--f-font); display: none; z-index: 1;
  transition: color .15s;
}
.fw-hdr-back:hover { color: white; }
.fw-hdr-back.show { display: block; }
.fw-hdr-center {
  flex: 1; display: flex; align-items: center; gap: 10px; z-index: 1;
}
.fw-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--f-sand); display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.fw-hdr-info { display: flex; flex-direction: column; }
.fw-hdr-name { color: white; font-size: 14px; font-weight: 700; letter-spacing: .02em; }
.fw-hdr-status { color: rgba(255,255,255,.7); font-size: 11px; display: flex; align-items: center; gap: 5px; }
.fw-online-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ADE80; }
.fw-hdr-actions { display: flex; gap: 4px; z-index: 1; }
.fw-hdr-btn {
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(255,255,255,.1); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,.7); transition: all .15s;
}
.fw-hdr-btn:hover { background: rgba(255,255,255,.18); color: white; }

/* ── Screens ── */
.fw-screens { flex: 1; position: relative; overflow: hidden; }
.fw-screen {
  position: absolute; inset: 0; overflow-y: auto;
  transform: translateX(40px); opacity: 0; pointer-events: none;
  transition: transform .32s cubic-bezier(.4,0,.2,1), opacity .28s;
  background: white;
}
.fw-screen.active { transform: translateX(0); opacity: 1; pointer-events: all; z-index: 2; }
.fw-screen.prev { transform: translateX(-28px); opacity: 0; z-index: 1; }
.fw-screen::-webkit-scrollbar { width: 4px; }
.fw-screen::-webkit-scrollbar-thumb { background: var(--f-sand); border-radius: 2px; }

/* ── Home hero ── */
.fw-home-hero {
  background: linear-gradient(135deg, var(--f-moss) 0%, #3d6049 50%, var(--f-sage) 100%);
  padding: 18px 20px 20px; position: relative; overflow: hidden;
}
.fw-home-hero::before {
  content:''; position: absolute; right: -40px; top: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(168,186,160,.15);
}
.fw-hero-label {
  color: var(--f-sand); font-size: 11px; font-weight: 700;
  margin-bottom: 6px; letter-spacing: .1em; text-transform: uppercase;
  position: relative;
}
.fw-hero-title {
  color: white; font-size: 19px; font-weight: 700;
  line-height: 1.3; margin-bottom: 12px; position: relative;
  font-family: var(--f-serif);
}
.fw-hero-title b { color: var(--f-sand); }
.fw-hero-chips { display: flex; gap: 7px; flex-wrap: wrap; position: relative; }
.fw-chip {
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.14);
  color: white; padding: 7px 12px; border-radius: 8px;
  font-size: 12px; font-weight: 500; font-family: var(--f-font);
  cursor: pointer; white-space: nowrap; transition: background .15s;
}
.fw-chip:hover { background: rgba(255,255,255,.22); }

/* ── Home body grid ── */
.fw-home-body { display: grid; grid-template-columns: 1.15fr 1fr; gap: 14px; padding: 14px 20px 0; }
.fw-home-col { display: flex; flex-direction: column; }

/* ── Showcase card (replaces match card) ── */
.fw-showcase {
  background: white; border: 2px solid var(--f-moss);
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 4px 20px rgba(47,74,58,.10);
}
.fw-showcase-head {
  background: var(--f-moss); color: white; padding: 8px 14px;
  font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  display: flex; align-items: center; justify-content: space-between;
}
.fw-showcase-body { padding: 14px; }
.fw-showcase-title {
  font-family: var(--f-serif); font-size: 15px; font-weight: 700;
  color: var(--f-ink); margin-bottom: 6px; line-height: 1.3;
}
.fw-showcase-desc { font-size: 12px; color: #6B7A6E; line-height: 1.5; margin-bottom: 12px; }
.fw-showcase-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 12px; }
.fw-tag {
  font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 5px;
  background: rgba(47,74,58,.08); color: var(--f-moss);
}
.fw-showcase-cta {
  background: var(--f-moss); color: white; border: none; border-radius: 10px;
  padding: 11px; width: 100%; font-size: 12px; font-weight: 700;
  font-family: var(--f-font); cursor: pointer; text-transform: uppercase;
  letter-spacing: .04em; transition: background .15s;
}
.fw-showcase-cta:hover { background: var(--f-moss-dk); }

/* ── Tiles ── */
.fw-sec-label {
  padding: 0 0 8px; font-size: 11px; font-weight: 700;
  letter-spacing: .07em; color: #8E8E93; text-transform: uppercase;
}
.fw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.fw-tile {
  background: var(--f-mist); border: 1px solid var(--f-border);
  border-radius: var(--f-r-sm); padding: 12px; cursor: pointer;
  transition: all .18s;
}
.fw-tile:hover { border-color: var(--f-moss); background: rgba(47,74,58,.04); transform: translateY(-1px); }
.fw-tile-ic {
  width: 36px; height: 36px; border-radius: 9px;
  background: white; border: 1px solid var(--f-border);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 8px;
}
.fw-tile-name { font-size: 13px; font-weight: 600; color: var(--f-ink); }
.fw-tile-sub { font-size: 11px; color: #8E8E93; }

.fw-home-cta {
  margin: 14px 20px 16px;
  background: var(--f-ink); color: white; border: none;
  border-radius: var(--f-r-sm); padding: 13px 20px;
  width: calc(100% - 40px); font-size: 13px; font-weight: 700;
  font-family: var(--f-font); cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  text-transform: uppercase; letter-spacing: .04em; transition: background .15s;
}
.fw-home-cta:hover { background: #2a3530; }

/* ── Screen heads ── */
.fw-screen-head { padding: 20px 20px 12px; }
.fw-screen-head h2 { font-size: 18px; font-weight: 700; color: var(--f-ink); margin-bottom: 4px; font-family: var(--f-serif); }
.fw-screen-head p { font-size: 13px; color: #8E8E93; line-height: 1.5; }

/* ── Info blocks ── */
.fw-info-block {
  background: var(--f-mist); border: 1px solid var(--f-border);
  border-radius: var(--f-r-sm); padding: 13px 15px; margin: 0 20px 10px;
}
.fw-info-lbl {
  font-size: 10px; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: var(--f-moss); margin-bottom: 6px;
}
.fw-info-text { font-size: 13px; color: var(--f-ink); line-height: 1.55; }

/* ── Service cards (for BRF/Kommun screens) ── */
.fw-svc-card {
  background: var(--f-mist); border: 1px solid var(--f-border);
  border-radius: var(--f-r-sm); padding: 14px 16px; margin: 0 20px 9px;
  cursor: pointer; transition: all .18s; display: flex; align-items: center; gap: 13px;
}
.fw-svc-card:hover { border-color: var(--f-moss); background: rgba(47,74,58,.04); }
.fw-svc-ic {
  width: 44px; height: 44px; border-radius: 11px;
  background: white; border: 1px solid var(--f-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.fw-svc-name { font-size: 13px; font-weight: 600; color: var(--f-ink); }
.fw-svc-desc { font-size: 12px; color: #8E8E93; margin-top: 2px; }

/* ── Action buttons row ── */
.fw-actions { padding: 6px 20px 16px; display: flex; gap: 8px; }
.fw-action-btn {
  flex: 1; padding: 12px; border-radius: var(--f-r-sm);
  font-size: 13px; font-weight: 700; font-family: var(--f-font);
  cursor: pointer; text-align: center; transition: all .15s;
}
.fw-action-primary { background: var(--f-moss); color: white; border: none; }
.fw-action-primary:hover { background: var(--f-moss-dk); }
.fw-action-secondary { background: white; color: var(--f-moss); border: 1.5px solid var(--f-border); }
.fw-action-secondary:hover { border-color: var(--f-moss); }

/* ── Request flow ── */
.fw-progress { padding: 14px 20px 0; }
.fw-progress-label { font-size: 11px; font-weight: 600; color: #8E8E93; margin-bottom: 8px; }
.fw-progress-bar { height: 4px; background: var(--f-sand); border-radius: 3px; overflow: hidden; }
.fw-progress-fill {
  height: 100%; background: var(--f-moss); border-radius: 3px;
  transition: width .5s cubic-bezier(.4,0,.2,1);
}

.fw-step { padding: 16px 20px; }
.fw-step-q {
  font-size: 14px; font-weight: 600; color: var(--f-ink);
  margin-bottom: 14px; line-height: 1.4;
}

/* Radio cards */
.fw-radio {
  display: flex; align-items: center; gap: 10px;
  background: var(--f-mist); border: 1.5px solid var(--f-border);
  border-radius: var(--f-r-sm); padding: 12px 14px; margin-bottom: 8px;
  cursor: pointer; transition: all .15s; font-size: 13px; font-weight: 500; color: var(--f-ink);
}
.fw-radio:hover { border-color: var(--f-sage); }
.fw-radio.selected { border-color: var(--f-moss); background: rgba(47,74,58,.06); }
.fw-radio-dot {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid var(--f-border); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: border-color .15s;
}
.fw-radio.selected .fw-radio-dot { border-color: var(--f-moss); }
.fw-radio.selected .fw-radio-dot::after {
  content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--f-moss);
}

/* Multi-select chips */
.fw-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.fw-chip-select {
  padding: 9px 14px; border-radius: 20px;
  border: 1.5px solid var(--f-border); background: var(--f-mist);
  font-size: 12.5px; font-weight: 500; color: var(--f-ink);
  cursor: pointer; transition: all .15s; font-family: var(--f-font);
}
.fw-chip-select:hover { border-color: var(--f-sage); }
.fw-chip-select.selected { border-color: var(--f-moss); background: var(--f-moss); color: white; }

/* Text inputs */
.fw-input {
  width: 100%; padding: 12px 14px; border-radius: var(--f-r-sm);
  border: 1.5px solid var(--f-border); background: var(--f-mist);
  font-size: 13.5px; font-family: var(--f-font); color: var(--f-ink);
  outline: none; transition: border-color .15s;
}
.fw-input:focus { border-color: var(--f-moss); }
.fw-input.error { border-color: #E53E3E; }
.fw-textarea { resize: none; min-height: 100px; line-height: 1.5; }
.fw-char-count { font-size: 11px; color: #8E8E93; text-align: right; margin-top: 4px; }
.fw-error { font-size: 11px; color: #E53E3E; margin-top: 4px; }
.fw-field { margin-bottom: 12px; }
.fw-label { font-size: 12px; font-weight: 600; color: var(--f-ink); margin-bottom: 6px; display: block; }

/* Next button */
.fw-next-bar { padding: 12px 20px 16px; }
.fw-next-btn {
  width: 100%; padding: 13px; border-radius: var(--f-r-sm);
  background: var(--f-moss); color: white; border: none;
  font-size: 13px; font-weight: 700; font-family: var(--f-font);
  cursor: pointer; text-transform: uppercase; letter-spacing: .04em;
  transition: all .15s; display: flex; align-items: center; justify-content: center; gap: 6px;
}
.fw-next-btn:hover:not(:disabled) { background: var(--f-moss-dk); }
.fw-next-btn:disabled { opacity: .4; cursor: not-allowed; }
.fw-terra-btn { background: var(--f-terra); }
.fw-terra-btn:hover:not(:disabled) { background: #9d6240; }

/* Summary */
.fw-summary-card {
  background: var(--f-mist); border: 1px solid var(--f-border);
  border-radius: var(--f-r-sm); padding: 12px 14px; margin-bottom: 10px;
}
.fw-summary-row { display: flex; justify-content: space-between; align-items: baseline; }
.fw-summary-lbl { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #8E8E93; }
.fw-summary-edit {
  font-size: 11px; color: var(--f-moss); font-weight: 600; cursor: pointer;
  background: none; border: none; font-family: var(--f-font);
}
.fw-summary-edit:hover { text-decoration: underline; }
.fw-summary-val { font-size: 13px; color: var(--f-ink); margin-top: 4px; line-height: 1.4; }

/* ── Done screen ── */
.fw-done { padding: 40px 20px; text-align: center; }
.fw-check-circle {
  width: 72px; height: 72px; margin: 0 auto 20px;
}
.fw-check-circle svg { width: 72px; height: 72px; }
.fw-check-circle .circle { stroke: var(--f-moss); stroke-width: 2; fill: none; stroke-dasharray: 200; stroke-dashoffset: 200; animation: fwCircleDraw .6s .2s forwards; }
.fw-check-circle .check { stroke: var(--f-moss); stroke-width: 3; fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 40; stroke-dashoffset: 40; animation: fwCheckDraw .4s .7s forwards; }
@keyframes fwCircleDraw { to { stroke-dashoffset: 0; } }
@keyframes fwCheckDraw { to { stroke-dashoffset: 0; } }
.fw-done-title { font-family: var(--f-serif); font-size: 22px; font-weight: 700; color: var(--f-ink); margin-bottom: 6px; }
.fw-done-sub { font-size: 13px; color: #8E8E93; margin-bottom: 6px; }
.fw-done-ref { font-size: 12px; color: var(--f-moss); font-weight: 600; margin-bottom: 24px; }
.fw-timeline { text-align: left; padding: 0 10px; margin-bottom: 24px; }
.fw-timeline-title { font-size: 12px; font-weight: 700; color: var(--f-ink); margin-bottom: 12px; }
.fw-tl-item { display: flex; gap: 12px; margin-bottom: 14px; position: relative; }
.fw-tl-dot {
  width: 24px; height: 24px; border-radius: 50%;
  background: rgba(47,74,58,.1); display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: 11px; font-weight: 700; color: var(--f-moss);
}
.fw-tl-text { font-size: 12.5px; color: var(--f-ink); line-height: 1.4; padding-top: 3px; }
.fw-tl-item:not(:last-child)::before {
  content: ''; position: absolute; left: 11.5px; top: 26px;
  width: 1px; height: calc(100% - 10px); background: var(--f-border);
}
.fw-done-actions { display: flex; gap: 8px; justify-content: center; }
.fw-done-btn {
  padding: 10px 20px; border-radius: var(--f-r-sm);
  font-size: 13px; font-weight: 600; font-family: var(--f-font); cursor: pointer;
  transition: all .15s;
}

/* ── Contact cards ── */
.fw-ct-card {
  background: var(--f-mist); border: 1px solid var(--f-border);
  border-radius: var(--f-r-sm); padding: 14px 16px; margin: 0 20px 9px;
  display: flex; align-items: center; gap: 13px; cursor: pointer;
  transition: all .18s;
}
.fw-ct-card:hover { border-color: var(--f-moss); background: rgba(47,74,58,.04); }
.fw-ct-ic {
  width: 44px; height: 44px; border-radius: 11px;
  background: white; border: 1px solid var(--f-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.fw-ct-lbl { font-size: 13px; font-weight: 600; color: var(--f-ink); }
.fw-ct-val { font-size: 12px; color: #8E8E93; margin-top: 2px; }

/* ── Map placeholder ── */
.fw-map {
  margin: 10px 20px 16px; background: #E8E3D8; border-radius: var(--f-r-sm);
  height: 120px; display: flex; align-items: center; justify-content: center;
  gap: 8px; color: #8E8E93; font-size: 12px; font-weight: 500;
}

/* ── Chat ── */
.fw-chat-screen { display: flex; flex-direction: column; background: var(--f-mist); }
.fw-chat-msgs {
  flex: 1; overflow-y: auto; padding: 16px;
  display: flex; flex-direction: column; gap: 12px;
}
.fw-cb { display: flex; gap: 8px; align-items: flex-end; max-width: 85%; }
.fw-cb.bot { align-self: flex-start; }
.fw-cb.usr { align-self: flex-end; flex-direction: row-reverse; }
.fw-cb-av {
  width: 28px; height: 28px; border-radius: 50%;
  background: white; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; border: 1.5px solid var(--f-moss); overflow: hidden;
}
.fw-cb-msg {
  background: white; border: 1px solid var(--f-border);
  border-radius: 14px 14px 14px 4px;
  padding: 10px 13px; font-size: 13.5px; color: var(--f-ink); line-height: 1.55;
}
.fw-cb.usr .fw-cb-msg {
  background: var(--f-moss); border-color: transparent;
  color: white; border-radius: 14px 14px 4px 14px;
}
.fw-typing-dots { display: flex; gap: 4px; padding: 5px 2px; }
.fw-typing-dots span {
  width: 7px; height: 7px; border-radius: 50%;
  background: #8E8E93; animation: fwTd 1.2s infinite;
}
.fw-typing-dots span:nth-child(2) { animation-delay: .2s; }
.fw-typing-dots span:nth-child(3) { animation-delay: .4s; }
@keyframes fwTd { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-5px);opacity:1} }
.fw-chat-bar {
  padding: 12px 14px; background: white;
  border-top: 1px solid var(--f-border);
  display: flex; gap: 8px; flex-shrink: 0;
}
.fw-chat-input {
  flex: 1; background: var(--f-mist); border: 1px solid var(--f-border);
  border-radius: 10px; padding: 10px 12px; font-size: 13.5px;
  font-family: var(--f-font); color: var(--f-ink);
  resize: none; outline: none; min-height: 40px; max-height: 96px;
}
.fw-chat-input:focus { border-color: var(--f-moss); }
.fw-chat-send {
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--f-moss); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background .15s;
}
.fw-chat-send:hover { background: var(--f-moss-dk); }

/* ── Footer ── */
.fw-foot {
  padding: 9px 16px; border-top: 1px solid var(--f-border);
  display: flex; justify-content: center; flex-shrink: 0; background: white;
}
.fw-foot-link {
  text-decoration: none; color: var(--f-ink); font-size: 11.5px;
  font-weight: 600; display: flex; align-items: center; gap: 5px; opacity: .55;
  cursor: pointer; background: none; border: none; font-family: var(--f-font);
}
.fw-foot-link:hover { opacity: 1; }
.fw-foot-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--f-moss); }

/* ── Mobile: fullscreen panel ── */
@media (max-width: 639px) {
  .fw-panel { position: fixed; inset: 0; width: 100%; height: 100%; border-radius: 0; bottom: 0; right: 0; }
  .fw-panel.visible { transform: none; }
}
`;

/* ═══════════════════════════════════════════════════════════════
   INLINE SVG ICONS
   ═══════════════════════════════════════════════════════════════ */

const SvgLeaf = ({ size = 24, color = "#F5F1E8" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1.03-2.07c2.16-.99 4.28-2.21 5.68-3.93 1.4-1.72 2.44-4 2.58-7" />
    <path d="M17 8c.66-3.34-1-5-4-5S6 5 6 8c0 4 2 7 5 9" />
    <path d="M6 8c-1.5 0-3 1-3 3.5S5 15 6 15" />
  </svg>
);

const SvgLeafSmall = ({ size = 16, color = "var(--f-moss)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1.03-2.07c2.16-.99 4.28-2.21 5.68-3.93 1.4-1.72 2.44-4 2.58-7" />
    <path d="M17 8c.66-3.34-1-5-4-5S6 5 6 8c0 4 2 7 5 9" />
  </svg>
);

const SvgClose = ({ size = 22, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SvgChevronLeft = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const SvgPhone = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.18 12 19.79 19.79 0 0 1 2.11 3.18 2 2 0 0 1 4.07 1h3a2 2 0 0 1 2 1.72c.13.81.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 2 .57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const SvgArrowRight = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const SvgCheck = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SvgSend = ({ size = 15, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const SvgPin = ({ size = 16, color = "#8E8E93" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   DATA & CONSTANTS
   ═══════════════════════════════════════════════════════════════ */

const BESTÄLLARTYPER = ["BRF", "Privat", "Kommun", "Byggbolag", "Annat"];

const UPPDRAGSTYPER = [
  "Landskapsarkitektur", "Dagvatten", "Förvaltning",
  "Nyanläggning", "Besiktning", "Rådgivning",
];

const PROJEKTSKEDEN = ["Idé", "Tidigt skede", "Pågående projekt", "Befintlig anläggning"];

/* Chat demo responses — keyword matching like KFF widget */
const CHAT_REPLIES = {
  brf: "Absolut! Vi har lång erfarenhet av att arbeta med bostadsrättsföreningar. Från förvaltningsavtal till totalomgestaltning av gårdar. Tryck på \"BRF\" i menyn så visar jag våra vanligaste uppdrag. 🌿",
  dagvatten: "Dagvatten är en av våra specialiteter. Vi designar regnbäddar, svackdiken och blågrön infrastruktur som hanterar vatten smart och vackert. Vill du starta en förfrågan?",
  park: "Vi gestaltar parker, lekplatser och torg i hela Sverige. Från intima fickparker till storskaliga stadsparker. Kontakta oss så berättar vi mer!",
  pris: "Priset beror på projektets omfattning. Starta en projektförfrågan så återkommer vi med en uppskattning inom 24 timmar. 📋",
  kontor: "Vi har kontor i Stockholm (Ringvägen 100) och Linköping (Storgatan 20). Ring oss på 08-669 39 06 eller mejla info@funkia.se.",
  förvaltning: "Vi erbjuder årliga förvaltningsavtal med skötselplaner, besiktning och löpande rådgivning. Perfekt för BRF:er och fastighetsägare som vill ge sin utemiljö långsiktig omsorg.",
  default: "Bra fråga! Jag hjälper dig med information om våra tjänster inom landskapsarkitektur, dagvatten och förvaltning. Du kan också starta en projektförfrågan direkt i widgeten. 🌱",
};

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* ═══════════════════════════════════════════════════════════════
   WIDGET COMPONENT
   ═══════════════════════════════════════════════════════════════ */

function FunkiaWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [hasOpened, setHasOpened] = useState(false);
  const [screen, setScreen] = useState("home");
  const [prevScreen, setPrevScreen] = useState(null);
  const [screenHistory, setScreenHistory] = useState([]);

  /* Request flow */
  const [reqStep, setReqStep] = useState(1);
  const [form, setForm] = useState({
    beställartyp: "", uppdrag: [], skede: "", plats: "",
    beskrivning: "", namn: "", företag: "", epost: "", telefon: "",
  });
  const [errors, setErrors] = useState({});

  /* Chat */
  const [chatMsgs, setChatMsgs] = useState([
    { from: "bot", text: "Hej och välkommen! 🌿 Jag är Sam, Funkias assistent. Fråga mig om våra tjänster, kontor eller projekt. Vad vill du veta?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  /* ── Inject CSS once ── */
  useEffect(() => {
    const id = "fw-styles";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = WIDGET_CSS;
      document.head.appendChild(s);
    }
  }, []);

  /* ── Auto-scroll chat ── */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMsgs]);

  /* ── Screen navigation (KFF-style) ── */
  const showScreen = useCallback((id) => {
    if (id === screen) return;
    setPrevScreen(screen);
    setScreenHistory((h) => [...h, screen]);
    setScreen(id);
    // Clear prev after transition
    setTimeout(() => setPrevScreen(null), 350);
  }, [screen]);

  const goBack = useCallback(() => {
    if (screen === "request" && reqStep > 1) {
      setReqStep((s) => s - 1);
      setErrors({});
      return;
    }
    const prev = screenHistory[screenHistory.length - 1];
    if (prev) {
      setPrevScreen(screen);
      setScreenHistory((h) => h.slice(0, -1));
      setScreen(prev);
      setTimeout(() => setPrevScreen(null), 350);
    }
  }, [screen, screenHistory, reqStep]);

  const goHome = useCallback(() => {
    setPrevScreen(screen);
    setScreen("home");
    setScreenHistory([]);
    setReqStep(1);
    setTimeout(() => setPrevScreen(null), 350);
  }, [screen]);

  const resetAll = useCallback(() => {
    setScreen("home");
    setScreenHistory([]);
    setReqStep(1);
    setForm({ beställartyp: "", uppdrag: [], skede: "", plats: "", beskrivning: "", namn: "", företag: "", epost: "", telefon: "" });
    setErrors({});
  }, []);

  /* ── Toggle widget ── */
  const toggle = () => {
    setIsOpen(!isOpen);
    setBubbleVisible(false);
    if (!hasOpened) setHasOpened(true);
  };

  /* ── Request flow validation ── */
  const validateStep = () => {
    const e = {};
    switch (reqStep) {
      case 1: if (!form.beställartyp) e.beställartyp = "Välj typ"; break;
      case 2: if (!form.uppdrag.length) e.uppdrag = "Välj minst ett"; break;
      case 3: if (!form.skede) e.skede = "Välj skede"; break;
      case 4: if (!form.plats.trim()) e.plats = "Ange ort"; break;
      case 5: if (!form.beskrivning.trim()) e.beskrivning = "Skriv en kort beskrivning"; break;
      case 6:
        if (!form.namn.trim()) e.namn = "Ange namn";
        if (!form.epost.trim()) e.epost = "Ange e-post";
        else if (!isValidEmail(form.epost)) e.epost = "Ogiltig e-postadress";
        if (!form.telefon.trim()) e.telefon = "Ange telefonnummer";
        break;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (reqStep < 7) { setReqStep(reqStep + 1); setErrors({}); }
  };

  const submitRequest = () => {
    const refId = "FK-2026-0414-A" + Math.floor(Math.random() * 90 + 10);
    /* ════════════════════════════════════════════════════════════
       TODO: POST till Autoflow-webhook
       fetch("https://autoflow.samify.se/webhook/funkia", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       });
       ════════════════════════════════════════════════════════════ */
    const payload = {
      source: "funkia-widget-demo",
      reference_id: refId,
      timestamp: new Date().toISOString(),
      segment: form.beställartyp,
      contact: { name: form.namn, company: form.företag, email: form.epost, phone: form.telefon },
      project: { uppdragstyper: form.uppdrag, skede: form.skede, ort: form.plats, beskrivning: form.beskrivning },
    };
    console.log("═══ FUNKIA PROJEKTFÖRFRÅGAN ═══");
    console.log(JSON.stringify(payload, null, 2));
    console.log("════════════════════════════════");
    showScreen("done");
  };

  /* ── Chat (demo mode with keyword matching — like KFF) ── */
  const sendChat = () => {
    if (chatBusy || !chatInput.trim()) return;
    const txt = chatInput.trim();
    setChatInput("");
    setChatBusy(true);
    setChatMsgs((m) => [...m, { from: "usr", text: txt }]);
    // Typing indicator
    setChatMsgs((m) => [...m, { from: "typing", text: "" }]);
    setTimeout(() => {
      const lower = txt.toLowerCase();
      let reply = CHAT_REPLIES.default;
      for (const key in CHAT_REPLIES) {
        if (key !== "default" && lower.includes(key)) { reply = CHAT_REPLIES[key]; break; }
      }
      setChatMsgs((m) => [...m.filter((x) => x.from !== "typing"), { from: "bot", text: reply }]);
      setChatBusy(false);
    }, 900);
  };

  const chatKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } };

  /* ── Helper: screen class ── */
  const sc = (id) => {
    if (screen === id) return "fw-screen active";
    if (prevScreen === id) return "fw-screen prev";
    return "fw-screen";
  };

  const TITLES = {
    home: "Funkia", brf: "Privat & BRF", kommun: "Kommun & Bygg",
    request: `Projektförfrågan`, chat: "Sam — Assistent",
    contact: "Kontakt", done: "Bekräftelse",
  };
  const showBack = screen !== "home" && screen !== "done";

  /* ═══════ RENDER: Request step ═══════ */
  const renderRequestStep = () => {
    switch (reqStep) {
      case 1: return (
        <div className="fw-step">
          <div className="fw-step-q">Vilken typ av beställare är du?</div>
          {BESTÄLLARTYPER.map((t) => (
            <div key={t} className={`fw-radio${form.beställartyp === t ? " selected" : ""}`}
              onClick={() => { setForm({ ...form, beställartyp: t }); setErrors({}); }}>
              <div className="fw-radio-dot" />{t}
            </div>
          ))}
          {errors.beställartyp && <div className="fw-error">{errors.beställartyp}</div>}
        </div>
      );
      case 2: return (
        <div className="fw-step">
          <div className="fw-step-q">Vilka uppdrag är du intresserad av?</div>
          <div className="fw-chips">
            {UPPDRAGSTYPER.map((t) => (
              <button key={t}
                className={`fw-chip-select${form.uppdrag.includes(t) ? " selected" : ""}`}
                onClick={() => {
                  setForm({ ...form, uppdrag: form.uppdrag.includes(t) ? form.uppdrag.filter((x) => x !== t) : [...form.uppdrag, t] });
                  setErrors({});
                }}>{t}</button>
            ))}
          </div>
          {errors.uppdrag && <div className="fw-error">{errors.uppdrag}</div>}
        </div>
      );
      case 3: return (
        <div className="fw-step">
          <div className="fw-step-q">Var befinner sig projektet just nu?</div>
          {PROJEKTSKEDEN.map((s) => (
            <div key={s} className={`fw-radio${form.skede === s ? " selected" : ""}`}
              onClick={() => { setForm({ ...form, skede: s }); setErrors({}); }}>
              <div className="fw-radio-dot" />{s}
            </div>
          ))}
          {errors.skede && <div className="fw-error">{errors.skede}</div>}
        </div>
      );
      case 4: return (
        <div className="fw-step">
          <div className="fw-step-q">Var finns projektet?</div>
          <input className={`fw-input${errors.plats ? " error" : ""}`} placeholder="T.ex. Stockholm, Södertälje..."
            value={form.plats} onChange={(e) => { setForm({ ...form, plats: e.target.value }); setErrors({}); }} />
          {errors.plats && <div className="fw-error">{errors.plats}</div>}
        </div>
      );
      case 5: return (
        <div className="fw-step">
          <div className="fw-step-q">Beskriv kort vad ni vill åstadkomma.</div>
          <textarea className={`fw-input fw-textarea${errors.beskrivning ? " error" : ""}`}
            placeholder="Berätta om era tankar och önskemål..."
            maxLength={500} value={form.beskrivning}
            onChange={(e) => { setForm({ ...form, beskrivning: e.target.value }); setErrors({}); }} />
          <div className="fw-char-count">{form.beskrivning.length} / 500</div>
          {errors.beskrivning && <div className="fw-error">{errors.beskrivning}</div>}
        </div>
      );
      case 6: return (
        <div className="fw-step">
          <div className="fw-step-q">Hur når vi dig?</div>
          {[
            { key: "namn", label: "Namn *", placeholder: "Ditt namn", type: "text" },
            { key: "företag", label: "Företag / BRF", placeholder: "Organisation (valfritt)", type: "text" },
            { key: "epost", label: "E-post *", placeholder: "din@epost.se", type: "email" },
            { key: "telefon", label: "Telefon *", placeholder: "070-000 00 00", type: "tel" },
          ].map((f) => (
            <div key={f.key} className="fw-field">
              <label className="fw-label">{f.label}</label>
              <input className={`fw-input${errors[f.key] ? " error" : ""}`} type={f.type}
                placeholder={f.placeholder} value={form[f.key]}
                onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); setErrors({ ...errors, [f.key]: undefined }); }} />
              {errors[f.key] && <div className="fw-error">{errors[f.key]}</div>}
            </div>
          ))}
        </div>
      );
      case 7: return (
        <div className="fw-step">
          <div className="fw-step-q">Stämmer allt?</div>
          {[
            { label: "Beställartyp", val: form.beställartyp, step: 1 },
            { label: "Uppdrag", val: form.uppdrag.join(", "), step: 2 },
            { label: "Projektskede", val: form.skede, step: 3 },
            { label: "Ort", val: form.plats, step: 4 },
            { label: "Beskrivning", val: form.beskrivning, step: 5 },
            { label: "Kontakt", val: `${form.namn}${form.företag ? ` — ${form.företag}` : ""}\n${form.epost}\n${form.telefon}`, step: 6 },
          ].map((item) => (
            <div key={item.label} className="fw-summary-card">
              <div className="fw-summary-row">
                <span className="fw-summary-lbl">{item.label}</span>
                <button className="fw-summary-edit" onClick={() => setReqStep(item.step)}>Ändra</button>
              </div>
              <div className="fw-summary-val" style={{ whiteSpace: "pre-line" }}>{item.val}</div>
            </div>
          ))}
        </div>
      );
      default: return null;
    }
  };

  /* ═══════ RENDER ═══════ */
  return (
    <div className="fw-root">
      {/* ── Bubble hint ── */}
      {bubbleVisible && !hasOpened && (
        <div className={`fw-bubble${!bubbleVisible ? " hidden" : ""}`} onClick={toggle}>
          <button className="fw-bubble-close" onClick={(e) => { e.stopPropagation(); setBubbleVisible(false); }}>✕</button>
          <div className="fw-bubble-text">🌿 Behöver ni hjälp med er utemiljö? Starta en förfrågan →</div>
        </div>
      )}

      {/* ── Launcher ── */}
      <button className={`fw-btn${isOpen ? " open" : ""}`} onClick={toggle}>
        <span className="fw-pulse" />
        <span className="fw-pulse" />
        {!isOpen && <span className="fw-notif">1</span>}
        <span className="ic-leaf"><SvgLeaf size={26} /></span>
        <span className="ic-close"><SvgClose size={22} /></span>
      </button>

      {/* ── Panel ── */}
      <div className={`fw-panel${isOpen ? " visible" : ""}`}>
        {/* Header */}
        <div className="fw-hdr">
          <div className="fw-hdr-deco" />
          <button className={`fw-hdr-back${showBack ? " show" : ""}`}
            onClick={goBack}>
            <SvgChevronLeft size={20} color="rgba(255,255,255,.7)" />
          </button>
          <div className="fw-hdr-center">
            <div className="fw-avatar">
              <SvgLeafSmall size={20} color="var(--f-moss)" />
            </div>
            <div className="fw-hdr-info">
              <div className="fw-hdr-name">{TITLES[screen] || "Funkia"}</div>
              <div className="fw-hdr-status"><span className="fw-online-dot" />Online nu</div>
            </div>
          </div>
          <div className="fw-hdr-actions">
            <button className="fw-hdr-btn" onClick={() => showScreen("contact")}>
              <SvgPhone size={15} color="rgba(255,255,255,.7)" />
            </button>
            <button className="fw-hdr-btn" onClick={toggle}>
              <SvgClose size={16} color="rgba(255,255,255,.7)" />
            </button>
          </div>
        </div>

        {/* Screens */}
        <div className="fw-screens">

          {/* ── HOME ── */}
          <div className={sc("home")}>
            <div className="fw-home-hero">
              <div className="fw-hero-label">🌿 Välkommen till Funkia</div>
              <div className="fw-hero-title">
                Hej! Hur kan vi hjälpa dig med din <b>utemiljö</b>?
              </div>
              <div className="fw-hero-chips">
                <button className="fw-chip" onClick={() => showScreen("request")}>📋 Projektförfrågan</button>
                <button className="fw-chip" onClick={() => showScreen("chat")}>💬 Fråga Sam</button>
                <button className="fw-chip" onClick={() => showScreen("contact")}>📞 Kontakt</button>
              </div>
            </div>

            <div className="fw-home-body">
              <div className="fw-home-col">
                {/* Showcase card */}
                <div className="fw-showcase">
                  <div className="fw-showcase-head">
                    <span>🌱 Aktuellt projekt</span>
                  </div>
                  <div className="fw-showcase-body">
                    <div className="fw-showcase-title">Brf Solängen — Gårdsupprustning</div>
                    <div className="fw-showcase-desc">
                      Totalomgestaltning av innergård i Södermalm. Biologisk mångfald, dagvatten och sociala ytor i samklang.
                    </div>
                    <div className="fw-showcase-tags">
                      <span className="fw-tag">Gestaltning</span>
                      <span className="fw-tag">Dagvatten</span>
                      <span className="fw-tag">BRF</span>
                    </div>
                    <button className="fw-showcase-cta" onClick={() => showScreen("brf")}>Se våra BRF-tjänster →</button>
                  </div>
                </div>
              </div>

              <div className="fw-home-col">
                <div className="fw-sec-label">Snabbval</div>
                <div className="fw-grid">
                  <div className="fw-tile" onClick={() => showScreen("brf")}>
                    <div className="fw-tile-ic">🏡</div>
                    <div className="fw-tile-name">Privat & BRF</div>
                    <div className="fw-tile-sub">Gårdar & trädgårdar</div>
                  </div>
                  <div className="fw-tile" onClick={() => showScreen("kommun")}>
                    <div className="fw-tile-ic">🏛️</div>
                    <div className="fw-tile-name">Kommun</div>
                    <div className="fw-tile-sub">Parker & stadsrum</div>
                  </div>
                  <div className="fw-tile" onClick={() => showScreen("request")}>
                    <div className="fw-tile-ic">✏️</div>
                    <div className="fw-tile-name">Förfrågan</div>
                    <div className="fw-tile-sub">Offert inom 24h</div>
                  </div>
                  <div className="fw-tile" onClick={() => showScreen("chat")}>
                    <div className="fw-tile-ic">💬</div>
                    <div className="fw-tile-name">Chatta</div>
                    <div className="fw-tile-sub">Fråga Sam</div>
                  </div>
                </div>
              </div>
            </div>

            <button className="fw-home-cta" onClick={() => showScreen("request")}>
              <SvgArrowRight size={14} color="white" />
              Starta en projektförfrågan
            </button>
          </div>

          {/* ── BRF ── */}
          <div className={sc("brf")}>
            <div className="fw-screen-head">
              <h2>Privat & BRF</h2>
              <p>Vi hjälper er att skapa utemiljöer som berikar vardagen och höjer fastighetsvärdet.</p>
            </div>
            <div className="fw-svc-card" onClick={() => showScreen("request")}>
              <div className="fw-svc-ic">📋</div>
              <div>
                <div className="fw-svc-name">Årligt förvaltningsavtal</div>
                <div className="fw-svc-desc">Skötselplaner och löpande rådgivning</div>
              </div>
            </div>
            <div className="fw-svc-card" onClick={() => showScreen("request")}>
              <div className="fw-svc-ic">🌿</div>
              <div>
                <div className="fw-svc-name">Upprustning av gårdsmiljö</div>
                <div className="fw-svc-desc">Ny gestaltning som höjer trivseln</div>
              </div>
            </div>
            <div className="fw-svc-card" onClick={() => showScreen("request")}>
              <div className="fw-svc-ic">💧</div>
              <div>
                <div className="fw-svc-name">Dagvattenlösning för fastighet</div>
                <div className="fw-svc-desc">Hållbar hantering anpassad för er</div>
              </div>
            </div>
            <div className="fw-actions">
              <button className="fw-action-btn fw-action-primary" onClick={() => showScreen("request")}>Starta förfrågan</button>
              <button className="fw-action-btn fw-action-secondary" onClick={() => showScreen("contact")}>Kontakta oss</button>
            </div>
          </div>

          {/* ── KOMMUN ── */}
          <div className={sc("kommun")}>
            <div className="fw-screen-head">
              <h2>Kommun & Byggbolag</h2>
              <p>Erfaren partner i komplexa stadsutvecklingsprojekt med höga krav på hållbarhet.</p>
            </div>
            <div className="fw-svc-card" onClick={() => showScreen("request")}>
              <div className="fw-svc-ic">📐</div>
              <div>
                <div className="fw-svc-name">Ramavtal landskapsarkitektur</div>
                <div className="fw-svc-desc">Löpande stöd i plan- och gestaltningsfrågor</div>
              </div>
            </div>
            <div className="fw-svc-card" onClick={() => showScreen("request")}>
              <div className="fw-svc-ic">💧</div>
              <div>
                <div className="fw-svc-name">Dagvattenutredning</div>
                <div className="fw-svc-desc">Systemlösningar och blågrön infrastruktur</div>
              </div>
            </div>
            <div className="fw-svc-card" onClick={() => showScreen("request")}>
              <div className="fw-svc-ic">🌳</div>
              <div>
                <div className="fw-svc-name">Offentliga parkmiljöer</div>
                <div className="fw-svc-desc">Gestaltning av parker, torg och lekplatser</div>
              </div>
            </div>
            <div className="fw-actions">
              <button className="fw-action-btn fw-action-primary" onClick={() => showScreen("request")}>Starta förfrågan</button>
              <button className="fw-action-btn fw-action-secondary" onClick={() => showScreen("contact")}>Kontakta oss</button>
            </div>
          </div>

          {/* ── REQUEST FLOW ── */}
          <div className={sc("request")}>
            <div className="fw-progress">
              <div className="fw-progress-label">Steg {reqStep} av 7</div>
              <div className="fw-progress-bar">
                <div className="fw-progress-fill" style={{ width: `${(reqStep / 7) * 100}%` }} />
              </div>
            </div>
            {renderRequestStep()}
            <div className="fw-next-bar">
              {reqStep < 7 ? (
                <button className="fw-next-btn" onClick={nextStep}>
                  Nästa <SvgArrowRight size={13} color="white" />
                </button>
              ) : (
                <button className="fw-next-btn fw-terra-btn" onClick={submitRequest}>
                  Skicka förfrågan <SvgArrowRight size={13} color="white" />
                </button>
              )}
            </div>
          </div>

          {/* ── DONE ── */}
          <div className={sc("done")}>
            <div className="fw-done">
              <div className="fw-check-circle">
                <svg viewBox="0 0 72 72">
                  <circle className="circle" cx="36" cy="36" r="32" />
                  <polyline className="check" points="22,36 32,46 50,28" />
                </svg>
              </div>
              <div className="fw-done-title">Tack{form.namn ? `, ${form.namn}` : ""}! 🌱</div>
              <div className="fw-done-sub">Vi hör av oss inom 24 timmar.</div>
              <div className="fw-done-ref">Ref: FK-2026-0414-A{Math.floor(Math.random() * 90 + 10)}</div>

              <div className="fw-timeline">
                <div className="fw-timeline-title">Vad händer nu?</div>
                <div className="fw-tl-item">
                  <div className="fw-tl-dot">1</div>
                  <div className="fw-tl-text">Vi granskar din förfrågan</div>
                </div>
                <div className="fw-tl-item">
                  <div className="fw-tl-dot">2</div>
                  <div className="fw-tl-text">Rätt specialist kontaktar dig</div>
                </div>
                <div className="fw-tl-item">
                  <div className="fw-tl-dot">3</div>
                  <div className="fw-tl-text">Ni planerar projektet tillsammans</div>
                </div>
              </div>

              <div className="fw-done-actions">
                <button className="fw-done-btn" style={{ background: "var(--f-mist)", border: "1px solid var(--f-border)", color: "var(--f-ink)" }}
                  onClick={toggle}>Stäng</button>
                <button className="fw-done-btn" style={{ background: "var(--f-moss)", border: "none", color: "white" }}
                  onClick={() => { resetAll(); goHome(); }}>Ställ ny fråga</button>
              </div>
            </div>
          </div>

          {/* ── CHAT ── */}
          <div className={sc("chat")} style={{ display: "flex", flexDirection: "column", background: "var(--f-mist)" }}>
            <div className="fw-chat-msgs" ref={chatRef}>
              {chatMsgs.map((msg, i) => {
                if (msg.from === "typing") return (
                  <div key={`typing-${i}`} className="fw-cb bot">
                    <div className="fw-cb-av"><SvgLeafSmall size={14} color="var(--f-moss)" /></div>
                    <div className="fw-cb-msg"><div className="fw-typing-dots"><span /><span /><span /></div></div>
                  </div>
                );
                return (
                  <div key={i} className={`fw-cb ${msg.from === "usr" ? "usr" : "bot"}`}>
                    {msg.from === "bot" && <div className="fw-cb-av"><SvgLeafSmall size={14} color="var(--f-moss)" /></div>}
                    <div className="fw-cb-msg">{msg.text}</div>
                  </div>
                );
              })}
            </div>
            <div className="fw-chat-bar">
              <textarea className="fw-chat-input" ref={textareaRef}
                placeholder="Skriv din fråga..." rows={1}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={chatKey}
                onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px"; }}
              />
              <button className="fw-chat-send" onClick={sendChat}>
                <SvgSend size={15} />
              </button>
            </div>
          </div>

          {/* ── CONTACT ── */}
          <div className={sc("contact")}>
            <div className="fw-screen-head">
              <h2>Kontakta oss</h2>
              <p>Vi finns i Stockholm och Linköping</p>
            </div>
            <div className="fw-ct-card">
              <div className="fw-ct-ic">📞</div>
              <div><div className="fw-ct-lbl">Ring oss</div><div className="fw-ct-val">08-669 39 06</div></div>
            </div>
            <div className="fw-ct-card">
              <div className="fw-ct-ic">✉️</div>
              <div><div className="fw-ct-lbl">Mejla oss</div><div className="fw-ct-val">info@funkia.se</div></div>
            </div>
            <div className="fw-ct-card" onClick={() => showScreen("chat")}>
              <div className="fw-ct-ic">💬</div>
              <div><div className="fw-ct-lbl">Chatta med Sam</div><div className="fw-ct-val">Svarar direkt</div></div>
            </div>
            <div className="fw-info-block">
              <div className="fw-info-lbl">📍 Stockholm</div>
              <div className="fw-info-text">Ringvägen 100, 118 60 Stockholm</div>
            </div>
            <div className="fw-info-block">
              <div className="fw-info-lbl">📍 Linköping</div>
              <div className="fw-info-text">Storgatan 20, 582 23 Linköping</div>
            </div>
            <div className="fw-info-block">
              <div className="fw-info-lbl">🕐 Öppettider</div>
              <div className="fw-info-text">Måndag–Fredag 08:00–17:00</div>
            </div>
            <div className="fw-map">
              <SvgPin size={18} /> Stockholm · Linköping
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="fw-foot">
          <button className="fw-foot-link"><span className="fw-foot-dot" />Powered by Samify</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOCK FUNKIA WEBSITE (background context for the demo)
   ═══════════════════════════════════════════════════════════════ */

function FunkiaMockSite() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "var(--f-font)", color: "var(--f-ink)" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(245,241,232,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--f-sand)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SvgLeafSmall size={22} color="var(--f-moss)" />
            <span style={{ fontFamily: "var(--f-serif)", fontSize: 22, fontWeight: 700, color: "var(--f-moss)" }}>Funkia</span>
          </div>
          <div style={{ display: "flex", gap: 32, fontSize: 14, fontWeight: 500 }} className="fw-nav-desktop">
            {["Projekt", "Tjänster", "Om oss", "Kontakt"].map((item) => (
              <a key={item} href="#" style={{ color: "var(--f-ink)", textDecoration: "none" }}>{item}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #2F4A3A 0%, #3d6049 50%, #A8BAA0 100%)",
        minHeight: 480, position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08 }}>
          <svg width="100%" height="100%" viewBox="0 0 1200 600" fill="white">
            <ellipse cx="200" cy="300" rx="180" ry="260" transform="rotate(-20 200 300)" />
            <ellipse cx="900" cy="200" rx="140" ry="220" transform="rotate(15 900 200)" />
            <ellipse cx="600" cy="500" rx="200" ry="120" transform="rotate(-5 600 500)" />
          </svg>
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px", position: "relative" }}>
          <div style={{ maxWidth: 600 }}>
            <h1 style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 700, lineHeight: 1.15, color: "var(--f-cream)", marginBottom: 20 }}>
              Livsmiljöer för framtidens hållbara samhälle
            </h1>
            <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.6, color: "var(--f-cream)", opacity: 0.9, marginBottom: 28 }}>
              Funkia är ett landskapsarkitektkontor som skapar gröna miljöer med omsorg om både människor och natur. Sedan 1991 har vi gestaltat parker, bostadsgårdar och stadsrum i hela Sverige.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#services" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 12,
                background: "var(--f-cream)", color: "var(--f-moss)",
                fontSize: 14, fontWeight: 600, textDecoration: "none",
              }}>Våra tjänster</a>
              <a href="#contact" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 12,
                border: "1.5px solid rgba(245,241,232,0.4)", color: "var(--f-cream)",
                fontSize: 14, fontWeight: 600, textDecoration: "none",
              }}>Kontakta oss</a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ background: "var(--f-cream)", padding: "clamp(48px, 8vw, 80px) 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "var(--f-moss)", marginBottom: 8 }}>Våra tjänster</h2>
            <p style={{ fontSize: 15, color: "#8E8E93", maxWidth: 500, margin: "0 auto" }}>Helhetslösningar inom landskapsarkitektur, dagvatten och förvaltning.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { icon: "🌿", title: "Landskapsarkitektur", desc: "Gestaltning av parker, bostadsgårdar, torg och offentliga rum som berikar vardagen." },
              { icon: "💧", title: "Dagvatten", desc: "Hållbara dagvattenlösningar — regnbäddar, svackdiken och blågrön infrastruktur." },
              { icon: "🌳", title: "Förvaltning", desc: "Skötselplaner, besiktningar och kvalitetssäkring av gröna anläggningar." },
            ].map((svc) => (
              <div key={svc.title} style={{
                background: "white", border: "1px solid var(--f-sand)", borderRadius: 16,
                padding: 28, transition: "transform .2s",
              }}>
                <span style={{ fontSize: 32 }}>{svc.icon}</span>
                <h3 style={{ fontFamily: "var(--f-serif)", fontSize: 20, fontWeight: 700, color: "var(--f-moss)", margin: "16px 0 8px" }}>{svc.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6B7A6E" }}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section style={{ background: "linear-gradient(180deg, white 0%, var(--f-cream) 100%)", padding: "clamp(48px, 8vw, 80px) 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "var(--f-moss)", marginBottom: 20 }}>Om Funkia</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--f-ink)", marginBottom: 16 }}>
            Funkia grundades 1991 och är idag ett av Sveriges ledande landskapsarkitektkontor. Med kontor i Stockholm och Linköping arbetar vi med uppdrag i hela landet — från intima trädgårdar till storskaliga stadsutvecklingsprojekt.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--f-ink)" }}>
            Vi tror att en väl gestaltad utemiljö gör skillnad i människors liv. Vår drivkraft är att skapa platser där natur och vardagsliv möts — hållbart, vackert och funktionellt.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--f-moss)", color: "var(--f-cream)", padding: "48px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <SvgLeaf size={18} color="var(--f-cream)" />
              <span style={{ fontFamily: "var(--f-serif)", fontSize: 18, fontWeight: 700 }}>Funkia</span>
            </div>
            <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.6 }}>Landskapsarkitektur med omsorg om framtiden.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, opacity: 0.9 }}>Stockholm</h4>
            <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.8 }}>Ringvägen 100<br />118 60 Stockholm<br />08-669 39 06</p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, opacity: 0.9 }}>Linköping</h4>
            <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.8 }}>Storgatan 20<br />582 23 Linköping<br />013-31 10 80</p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, opacity: 0.9 }}>Kontakt</h4>
            <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.8 }}>info@funkia.se<br />08-669 39 06</p>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "32px auto 0", paddingTop: 24, borderTop: "1px solid rgba(245,241,232,0.15)", textAlign: "center", fontSize: 12, opacity: 0.5 }}>
          © {new Date().getFullYear()} Funkia Landskapsarkitektur AB
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEFAULT EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function FunkiaWidgetDemo() {
  return (
    <>
      <FunkiaMockSite />
      <FunkiaWidget />
    </>
  );
}
