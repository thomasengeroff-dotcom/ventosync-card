// src/styles.js
// ============================================================
// VentoSync Card – Styles
// CSS-in-JS for the custom card. Uses HA CSS custom properties
// for theme compatibility (light/dark mode).
// ============================================================

export const cardStyles = `
  /* ── Host ─────────────────────────────────────────────── */
  :host {
    --vs-card-padding: 16px;
    --vs-transition-speed: 0.3s;
    --vs-icon-size: 60%;
  }

  /* ── Card Container ───────────────────────────────────── */
  ha-card {
    overflow: hidden;
    padding: var(--vs-card-padding);
    position: relative;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .not-found {
    padding: 16px;
    color: var(--error-color, #db4437);
    text-align: center;
  }

  /* ── Header ───────────────────────────────────────────── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .name {
    font-size: 1.1em;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex: 1 1 0;
  }

  .preset-badge {
    font-size: 0.7em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 4px 10px;
    border-radius: 12px;
    background: var(--vs-preset-color, #4FC3F7);
    color: #fff;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    flex-shrink: 0;
    transition: transform 0.15s ease, opacity 0.15s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .preset-badge:active {
    transform: scale(0.92);
    opacity: 0.85;
  }

  /* ── Slider Container ─────────────────────────────────── */
  .slider-container {
    position: relative;
    width: 100%;
    max-width: 280px;
    aspect-ratio: 1;
  }

  .slider-svg {
    width: 100%;
    height: 100%;
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Track arc (background) */
  .slider-track {
    transition: stroke var(--vs-transition-speed) ease;
  }

  /* Active arc (filled) */
  .slider-active {
    transition: stroke var(--vs-transition-speed) ease,
                d var(--vs-transition-speed) ease;
  }

  .slider-active.dragging {
    transition: stroke var(--vs-transition-speed) ease;
    /* d transition disabled during drag for instant feedback */
  }

  /* Tick marks */
  .tick {
    transition: stroke var(--vs-transition-speed) ease,
                opacity var(--vs-transition-speed) ease;
  }

  /* CO₂ inner ring */
  .co2-ring-track {
    transition: stroke var(--vs-transition-speed) ease;
  }

  .co2-ring-active {
    transition: stroke var(--vs-transition-speed) ease,
                d var(--vs-transition-speed) ease;
    filter: drop-shadow(0 0 3px var(--vs-co2-glow, transparent));
  }

  /* Thumb */
  .thumb {
    cursor: grab;
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.25));
    transition: r 0.15s ease,
                stroke var(--vs-transition-speed) ease;
  }

  .thumb:hover {
    r: 12;
  }

  .thumb.dragging {
    cursor: grabbing;
    r: 13;
    transition: stroke var(--vs-transition-speed) ease;
  }

  /* ── Center Icon ──────────────────────────────────────── */
  .center-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: var(--vs-icon-size);
    height: var(--vs-icon-size);
    overflow: visible;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--vs-transition-speed) ease,
                opacity var(--vs-transition-speed) ease;
  }

  .center-icon.off {
    opacity: 0.35;
  }

  .center-icon.on {
    opacity: 1;
  }

  .center-icon:active {
    transform: translate(-50%, -55%) scale(0.95);
  }

  /* Custom SVG icon */
  .icon-svg {
    width: 70%;
    height: auto;
    transform: translateY(18px);
    color: var(--vs-icon-color, var(--primary-text-color));
    transition: color var(--vs-transition-speed) ease,
                filter var(--vs-transition-speed) ease,
                transform var(--vs-transition-speed) ease;
  }

  .center-icon.on .icon-svg {
    filter: drop-shadow(0 0 8px color-mix(in srgb, var(--vs-icon-color) 25%, transparent));
  }

  /* External icon via URL */
  .icon-img {
    width: 70%;
    height: auto;
    transform: translateY(18px);
    object-fit: contain;
    transition: filter var(--vs-transition-speed) ease,
                transform var(--vs-transition-speed) ease;
  }

  /* Step value display */
  .value-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2px;
  }

  /* CO₂ inline display (inside circle) */
  .co2-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    margin-top: 4px;
    margin-bottom: 0;
  }

  .co2-label {
    font-size: 0.65em;
    font-weight: 600;
    color: var(--vs-co2-color, var(--secondary-text-color));
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .co2-value {
    font-size: 1em;
    font-weight: 700;
    color: var(--vs-co2-color, var(--primary-text-color));
    line-height: 1;
  }

  .co2-unit {
    font-size: 0.6em;
    font-weight: 500;
    color: var(--vs-co2-color, var(--secondary-text-color));
    opacity: 0.7;
  }

  .value-step {
    font-size: 1.6em;
    font-weight: 700;
    line-height: 1;
    color: var(--primary-text-color);
  }

  .value-label {
    font-size: 0.75em;
    font-weight: 500;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 2px;
  }

  /* ── Sensor Row ───────────────────────────────────────── */
  .sensors {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
    padding-top: 12px;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
  }

  .sensor {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.85em;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }

  .sensor ha-icon {
    --mdc-icon-size: 16px;
    color: var(--secondary-text-color);
  }

  .sensor .sensor-value {
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .sensor .sensor-value.threshold-colored {
    font-weight: 600;
  }

  .sensor .sensor-unit {
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }

  /* ── Unavailable State ────────────────────────────────── */
  .unavailable .slider-svg {
    opacity: 0.3;
    pointer-events: none;
  }

  .unavailable .center-icon {
    opacity: 0.2;
    pointer-events: none;
  }

  .unavailable-text {
    font-size: 0.85em;
    color: var(--error-color, #db4437);
    text-align: center;
    margin-top: 4px;
  }

  /* ── Animations ───────────────────────────────────────── */

  /* Stoßlüftung (Boost): pulsing glow */
  :host([data-preset="Stoßlüftung"]) .center-icon.on .icon-svg {
    animation: vs-pulse 2s ease-in-out infinite;
  }

  @keyframes vs-pulse {
    0%, 100% {
      filter: drop-shadow(0 0 6px color-mix(in srgb, var(--vs-icon-color) 20%, transparent));
    }
    50% {
      filter: drop-shadow(0 0 16px color-mix(in srgb, var(--vs-icon-color) 45%, transparent));
    }
  }

  /* Smart-Automatik: slow breathing opacity (auto mode indicator) */
  :host([data-preset="Smart-Automatik"]) .center-icon.on .icon-svg {
    animation: vs-breathe 4s ease-in-out infinite;
  }

  @keyframes vs-breathe {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  /* ── Responsive ───────────────────────────────────────── */
  @media (max-width: 350px) {
    .slider-container {
      max-width: 220px;
    }
    .sensors {
      gap: 10px;
    }
    .sensor {
      font-size: 0.78em;
    }
  }
`;