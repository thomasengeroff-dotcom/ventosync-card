// src/constants.js
// ============================================================
// VentoSync Card – Constants & Configuration
// Central source of truth for colors, labels, icons, and defaults.
// ============================================================

// ── Card Metadata ──────────────────────────────────────────
export const CARD_VERSION = '1.0.0';
export const CARD_TAG = 'ventosync-card';
export const CARD_NAME = 'VentoSync HRV Control';
export const CARD_DESCRIPTION =
    'Circular fan control with real-time air quality monitoring for VentoSync HRV devices.';

// ── Fan Step Configuration ─────────────────────────────────
export const STEP_COUNT = 10;
export const STEP_LABELS = Object.freeze([
    '',           // 0 – Off
    'Min',        // 1
    'Nacht',      // 2
    'Leise',      // 3
    'Eco',        // 4
    'Normal',     // 5
    'Normal+',    // 6
    'Hoch',       // 7
    'Intensiv',   // 8
    'Intensiv+',  // 9
    'Boost',      // 10
]);

// ── Circular Slider Geometry ───────────────────────────────
export const SLIDER_DEFAULTS = Object.freeze({
    radius: 90,
    strokeWidth: 8,
    thumbRadius: 10,
    tickLength: 8,
    // Arc angles in degrees (0° = top, clockwise)
    arcStart: 135,    // Bottom-left
    arcEnd: 405,      // Bottom-right (135° + 270°)
    // SVG viewBox is computed from radius + padding
    padding: 20,
});

// ── Preset Mode Colors ─────────────────────────────────────
// Keys match the native VentoSync operating mode names (ESPHome preset_modes).
// Colors are chosen for readability on both light and dark HA themes.
export const PRESET_COLORS = Object.freeze({
    'Smart-Automatik':    { primary: '#81C784', track: 'rgba(129, 199, 132, 0.15)' },
    'Wärmerückgewinnung': { primary: '#4FC3F7', track: 'rgba(79, 195, 247, 0.15)' },
    'Durchlüften':       { primary: '#4DD0E1', track: 'rgba(77, 208, 225, 0.15)' },
    'Stoßlüftung':       { primary: '#FF8A65', track: 'rgba(255, 138, 101, 0.15)' },
    off:                  { primary: '#616161', track: 'rgba(97, 97, 97, 0.15)' },
});

// Fallback when preset is unknown
export const DEFAULT_COLORS = PRESET_COLORS['Wärmerückgewinnung'];

// ── CO₂ Thresholds (for color-coding) ─────────────────────
export const CO2_THRESHOLDS = Object.freeze([
    { max: 600, color: '#81C784', label: 'Exzellent' },
    { max: 800, color: '#AED581', label: 'Gut' },
    { max: 1000, color: '#FFD54F', label: 'Mäßig' },
    { max: 1200, color: '#FFB74D', label: 'Schlecht' },
    { max: 1500, color: '#FF8A65', label: 'Sehr schlecht' },
    { max: Infinity, color: '#E57373', label: 'Kritisch' },
]);

// ── CO₂ Ring Range (inner arc mapping) ─────────────────────
// Maps 400 ppm (fresh air) → 0% and 2000 ppm (critical) → 100%
export const CO2_RING_MIN = 400;
export const CO2_RING_MAX = 2000;

// ── IAQ Thresholds ─────────────────────────────────────────
export const IAQ_THRESHOLDS = Object.freeze([
    { max: 50, color: '#81C784', label: 'Exzellent' },
    { max: 100, color: '#AED581', label: 'Gut' },
    { max: 150, color: '#FFD54F', label: 'Mäßig' },
    { max: 200, color: '#FFB74D', label: 'Ungesund' },
    { max: 300, color: '#FF8A65', label: 'Schlecht' },
    { max: Infinity, color: '#E57373', label: 'Gefährlich' },
]);

// ── Sensor Display Configuration ───────────────────────────
export const SENSOR_CONFIG = Object.freeze({
    co2: { icon: 'mdi:molecule-co2', unit: 'ppm', label: 'CO₂', thresholds: CO2_THRESHOLDS },
    temperature: { icon: 'mdi:thermometer', unit: '°C', label: 'Temperatur', thresholds: null },
    humidity: { icon: 'mdi:water-percent', unit: '%', label: 'Feuchte', thresholds: null },
    iaq: { icon: 'mdi:air-filter', unit: 'IAQ', label: 'Luftqualität', thresholds: IAQ_THRESHOLDS },
    pressure: { icon: 'mdi:gauge', unit: 'hPa', label: 'Druck', thresholds: null },
    supply_temp: { icon: 'mdi:thermometer-plus', unit: '°C', label: 'Zuluft', thresholds: null },
    exhaust_temp: { icon: 'mdi:thermometer-minus', unit: '°C', label: 'Abluft', thresholds: null },
    heat_recovery: { icon: 'mdi:recycle-variant', unit: '%', label: 'Wärmerückg.', thresholds: null },
    presence: { icon: 'mdi:motion-sensor', unit: '', label: 'Anwesenheit', thresholds: null },
});

// ── Default Card Configuration ─────────────────────────────
export const DEFAULT_CONFIG = Object.freeze({
    entity: '',
    name: null,
    icon_url: null,
    sensors: {},
    show_sensors: ['co2', 'temperature', 'humidity'],
    // Slider overrides (optional)
    slider_radius: SLIDER_DEFAULTS.radius,
    slider_stroke: SLIDER_DEFAULTS.strokeWidth,
});

// ── HRV Icon (Inline SVG – Outline Variant) ───────────────
// Monochrome, uses currentColor for full CSS recoloring.
// No background circle – designed for the card center.
export const HRV_ICON_SVG = `
<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="vs-a" markerWidth="7" markerHeight="5" refX="6" refY="2.5"
            orient="auto-start-reverse" markerUnits="strokeWidth">
      <path d="M0,0 L7,2.5 L0,5Z" fill="currentColor" stroke="none"/>
    </marker>
  </defs>
  <path d="M58,88 V156 Q58,162 64,162 H136 Q142,162 142,156 V88"
        stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M50,92 L100,48 L150,92"
        stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M122,68 V46 H136 V78"
        stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
  <g transform="translate(129,32)" stroke-width="2.5" stroke-linecap="round">
    <line x1="0" y1="-9" x2="0" y2="9"/>
    <line x1="-7.8" y1="-4.5" x2="7.8" y2="4.5"/>
    <line x1="-7.8" y1="4.5" x2="7.8" y2="-4.5"/>
    <line x1="0" y1="-9" x2="-2.5" y2="-6"/>
    <line x1="0" y1="-9" x2="2.5" y2="-6"/>
    <line x1="0" y1="9" x2="-2.5" y2="6"/>
    <line x1="0" y1="9" x2="2.5" y2="6"/>
    <line x1="-7.8" y1="-4.5" x2="-5" y2="-5.5"/>
    <line x1="-7.8" y1="-4.5" x2="-6.5" y2="-1.5"/>
    <line x1="7.8" y1="4.5" x2="5" y2="5.5"/>
    <line x1="7.8" y1="4.5" x2="6.5" y2="1.5"/>
    <line x1="-7.8" y1="4.5" x2="-6.5" y2="1.5"/>
    <line x1="-7.8" y1="4.5" x2="-5" y2="5.5"/>
    <line x1="7.8" y1="-4.5" x2="6.5" y2="-1.5"/>
    <line x1="7.8" y1="-4.5" x2="5" y2="-5.5"/>
  </g>
  <line x1="80" y1="108" x2="24" y2="108" stroke-width="3.5"
        stroke-linecap="round" marker-end="url(#vs-a)"/>
  <line x1="20" y1="142" x2="76" y2="142" stroke-width="3.5"
        stroke-linecap="round" marker-end="url(#vs-a)"/>
  <line x1="120" y1="108" x2="176" y2="108" stroke-width="3.5"
        stroke-linecap="round" marker-end="url(#vs-a)"/>
  <line x1="180" y1="142" x2="124" y2="142" stroke-width="3.5"
        stroke-linecap="round" marker-end="url(#vs-a)"/>
  <line x1="62" y1="125" x2="138" y2="125" stroke-width="2"
        stroke-linecap="round" opacity="0.5"/>
  <g transform="translate(100,125)" stroke-width="4" stroke-linecap="round">
    <path d="M12,0 A12,12 0 1,0 -12,0" marker-end="url(#vs-a)"/>
    <path d="M-12,0 A12,12 0 1,0 12,0" marker-end="url(#vs-a)"/>
  </g>
</svg>`.trim();

// ── Helper: Get color for a threshold-based value ──────────
export function getThresholdColor(value, thresholds) {
    if (!thresholds || value === null || value === undefined || isNaN(value)) {
        return null;
    }
    for (const t of thresholds) {
        if (value <= t.max) {
            return t.color;
        }
    }
    return thresholds[thresholds.length - 1]?.color ?? null;
}

// ── Helper: Get label for a threshold-based value ──────────
export function getThresholdLabel(value, thresholds) {
    if (!thresholds || value === null || value === undefined || isNaN(value)) {
        return null;
    }
    for (const t of thresholds) {
        if (value <= t.max) {
            return t.label;
        }
    }
    return thresholds[thresholds.length - 1]?.label ?? null;
}

// ── Helper: Get preset colors with fallback ────────────────
export function getPresetColors(preset, isOn) {
    if (!isOn) {
        return PRESET_COLORS.off;
    }
    return PRESET_COLORS[preset] ?? DEFAULT_COLORS;
}