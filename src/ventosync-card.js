// src/ventosync-card.js
// ============================================================
// VentoSync Card – Main Entry Point
// Custom Lovelace card for VentoSync HRV fan control.
// ============================================================

import { CircularSlider } from './circular-slider.js';
import { cardStyles } from './styles.js';
import {
    CARD_VERSION,
    CARD_TAG,
    CARD_NAME,
    CARD_DESCRIPTION,
    STEP_COUNT,
    STEP_LABELS,
    DEFAULT_CONFIG,
    SENSOR_CONFIG,
    HRV_ICON_SVG,
    getPresetColors,
    getThresholdColor,
} from './constants.js';

// ── Console Banner ─────────────────────────────────────────
/* eslint-disable no-console */
console.info(
    `%c VENTOSYNC-CARD %c v${CARD_VERSION} `,
    'color:#fff;background:#4FC3F7;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'color:#4FC3F7;background:#eee;font-weight:700;padding:2px 6px;border-radius:0 4px 4px 0',
);
/* eslint-enable no-console */

// ── Card Class ─────────────────────────────────────────────
class VentoSyncCard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        /** @type {object|null} */
        this._config = null;
        /** @type {object|null} */
        this._hass = null;
        /** @type {CircularSlider|null} */
        this._slider = null;
        /** @type {number|null} */
        this._dragStep = null;
        /** @type {boolean} */
        this._initialized = false;
    }

    // ── Lifecycle ──────────────────────────────────────────

    connectedCallback() {
        // Re-render if we already have data (e.g. after being moved in DOM)
        if (this._config && this._hass) {
            this._render();
        }
    }

    disconnectedCallback() {
        if (this._slider) {
            this._slider.destroy();
        }
    }

    // ── Config ─────────────────────────────────────────────

    setConfig(config) {
        if (!config.entity) {
            throw new Error('VentoSync Card: "entity" is required.');
        }
        if (!config.entity.startsWith('fan.')) {
            throw new Error('VentoSync Card: entity must be a fan entity (fan.xxx).');
        }

        this._config = { ...DEFAULT_CONFIG, ...config };

        // (Re)create slider
        if (this._slider) {
            this._slider.destroy();
        }
        this._slider = new CircularSlider({
            radius: this._config.slider_radius,
            strokeWidth: this._config.slider_stroke,
            steps: STEP_COUNT,
            onValueChange: (step) => this._onSliderChange(step),
            onValueCommit: (step) => this._onSliderCommit(step),
        });

        this._initialized = false;
        if (this._hass) {
            this._render();
        }
    }

    // ── Hass Property ──────────────────────────────────────

    set hass(hass) {
        const oldState = this._entityState;
        this._hass = hass;
        const newState = this._entityState;

        // Only re-render if relevant state changed
        const changed =
            !oldState ||
            oldState.state !== newState?.state ||
            oldState.attributes?.percentage !== newState?.attributes?.percentage ||
            oldState.attributes?.preset_mode !== newState?.attributes?.preset_mode;

        if (changed || !this._initialized) {
            this._render();
        }
    }

    get hass() {
        return this._hass;
    }

    // ── Entity Accessors ───────────────────────────────────

    get _entityState() {
        return this._hass?.states?.[this._config?.entity];
    }

    get _isOn() {
        const state = this._entityState?.state;
        return state === 'on';
    }

    get _isUnavailable() {
        const state = this._entityState?.state;
        return !state || state === 'unavailable' || state === 'unknown';
    }

    get _currentStep() {
        const pct = this._entityState?.attributes?.percentage ?? 0;
        return Math.round(pct / (100 / STEP_COUNT));
    }

    get _displayStep() {
        if (this._dragStep !== null) {
            return this._dragStep;
        }
        return this._isOn ? this._currentStep : 0;
    }

    get _presetMode() {
        return this._entityState?.attributes?.preset_mode ?? 'Wärmerückgewinnung';
    }

    get _entityName() {
        return (
            this._config.name ??
            this._entityState?.attributes?.friendly_name ??
            'VentoSync'
        );
    }

    // ── Sensor Data ────────────────────────────────────────

    _getSensorData() {
        const sensors = this._config.sensors ?? {};
        const result = {};

        for (const [key, entityId] of Object.entries(sensors)) {
            if (!entityId) { continue; }
            const state = this._hass?.states?.[entityId];
            if (!state) { continue; }

            const sensorConf = SENSOR_CONFIG[key];
            const numValue = parseFloat(state.state);
            const isNumeric = !isNaN(numValue);

            result[key] = {
                value: isNumeric ? numValue : state.state,
                displayValue: isNumeric ? numValue.toFixed(key === 'pressure' ? 0 : 1) : state.state,
                unit: sensorConf?.unit ?? state.attributes?.unit_of_measurement ?? '',
                icon: sensorConf?.icon ?? 'mdi:information',
                label: sensorConf?.label ?? key,
                color: isNumeric ? getThresholdColor(numValue, sensorConf?.thresholds) : null,
                available: state.state !== 'unavailable',
            };
        }
        return result;
    }

    _getVisibleSensors() {
        const showList = this._config.show_sensors;
        const sensorData = this._getSensorData();

        if (!showList || showList.length === 0) {
            return Object.entries(sensorData);
        }
        return showList
            .filter((key) => sensorData[key])
            .map((key) => [key, sensorData[key]]);
    }

    // ── Slider Callbacks ───────────────────────────────────

    _onSliderChange(step) {
        this._dragStep = step;
        this._render();
    }

    _onSliderCommit(step) {
        this._dragStep = null;
        this._setFanStep(step);
        this._render();
    }

    // ── HA Service Calls ───────────────────────────────────

    _setFanStep(step) {
        if (!this._hass || !this._config) { return; }

        if (step === 0) {
            this._hass.callService('fan', 'turn_off', {
                entity_id: this._config.entity,
            });
        } else {
            const percentage = Math.round((step / STEP_COUNT) * 100);
            this._hass.callService('fan', 'set_percentage', {
                entity_id: this._config.entity,
                percentage,
            });
        }
    }

    _togglePower() {
        if (!this._hass || !this._config) { return; }
        this._hass.callService('fan', 'toggle', {
            entity_id: this._config.entity,
        });
    }

    _cyclePreset() {
        if (!this._hass || !this._config) { return; }
        const presets = this._entityState?.attributes?.preset_modes ?? [];
        if (presets.length === 0) { return; }

        const currentIdx = presets.indexOf(this._presetMode);
        const nextIdx = (currentIdx + 1) % presets.length;

        this._hass.callService('fan', 'set_preset_mode', {
            entity_id: this._config.entity,
            preset_mode: presets[nextIdx],
        });
    }

    // ── Render ─────────────────────────────────────────────

    _render() {
        if (!this._config || !this._hass) { return; }

        const entity = this._entityState;
        if (!entity) {
            this.shadowRoot.innerHTML = `
        <ha-card>
          <div class="not-found">
            Entity not found: <strong>${this._config.entity}</strong>
          </div>
        </ha-card>
      `;
            return;
        }

        const colors = getPresetColors(this._presetMode, this._isOn);
        const step = this._displayStep;
        const slider = this._slider;

        // Update slider value (without triggering callbacks)
        slider.value = step;

        // SVG geometry
        const trackPath = slider.getTrackPath();
        const activePath = slider.getActivePath(step);
        const thumb = slider.getThumbPosition(step);
        const ticks = slider.getTicks();
        const isDragging = slider.isDragging;

        // Sensor data
        const visibleSensors = this._getVisibleSensors();

        // Update host attribute for CSS animations
        this.setAttribute('data-preset', this._isOn ? this._presetMode : 'off');

        // Build HTML
        this.shadowRoot.innerHTML = `
      <style>${cardStyles}</style>
      <ha-card>
        <div class="card-content ${this._isUnavailable ? 'unavailable' : ''}">
<!---->
          <!-- Header -->
          <div class="header">
            <span class="name">${this._entityName}</span>
            ${this._isOn ? `
              <span class="preset-badge"
                    style="--vs-preset-color: ${colors.primary}">
                ${this._presetMode}
              </span>
            ` : ''}
          
</div>



          <!-- Circular Slider + Icon -->
          <div class="slider-container">
            <svg class="slider-svg"
                 viewBox="0 0 ${slider.size} ${slider.size}">
<!---->
              <!-- Track arc -->
              <path class="slider-track"
                    d="${trackPath}"
                    fill="none"
                    stroke="${colors.track}"
                    stroke-width="${slider.strokeWidth}"
                    stroke-linecap="round"/>
<!---->
              <!-- Tick marks -->
              ${ticks.map((t) => `
                <line class="tick"
                      x1="${t.x1}" y1="${t.y1}"
                      x2="${t.x2}" y2="${t.y2}"
                      stroke="${t.step <= step && this._isOn ? colors.primary : 'var(--divider-color, rgba(0,0,0,0.12))'}"
                      stroke-width="${t.isMajor ? 2.5 : 1.5}"
                      stroke-linecap="round"
                      opacity="${t.step <= step && this._isOn ? 1 : 0.3}"/>
              `).join('')}
<!---->
              <!-- Active arc -->
              ${activePath ? `
                <path class="slider-active ${isDragging ? 'dragging' : ''}"
                      d="${activePath}"
                      fill="none"
                      stroke="${colors.primary}"
                      stroke-width="${slider.strokeWidth}"
                      stroke-linecap="round"/>
              ` : ''}
<!---->
              <!-- Thumb -->
              ${this._isOn ? `
                <circle class="thumb ${isDragging ? 'dragging' : ''}"
                        cx="${thumb.x}" cy="${thumb.y}"
                        r="${isDragging ? 12 : 10}"
                        fill="white"
                        stroke="${colors.primary}"
                        stroke-width="2.5"/>
              ` : ''}
            </svg>
<!---->
            <!-- Center icon + value -->
            <div class="center-icon ${this._isOn ? 'on' : 'off'}"
                 style="--vs-icon-color: ${colors.primary}">
              ${this._config.icon_url
                ? `<img class="icon-img" src="${this._config.icon_url}" alt="HRV"/>`
                : `<div class="icon-svg">${HRV_ICON_SVG}
</div>

`
            }
              <div class="value-display">
                <span class="value-step">
                  ${this._isOn ? step : 'OFF'}
                </span>
                ${this._isOn && STEP_LABELS[step] ? `
                  <span class="value-label">${STEP_LABELS[step]}</span>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Unavailable notice -->
          ${this._isUnavailable ? `
            <div class="unavailable-text">Gerät nicht erreichbar</div>
          ` : ''}

          <!-- Sensor readouts -->
          ${visibleSensors.length > 0 ? `
            <div class="sensors">
              ${visibleSensors.map(([key, s]) => `
                <div class="sensor">
                  <ha-icon icon="${s.icon}"></ha-icon>
                  <span class="sensor-value ${s.color ? 'threshold-colored' : ''}"
                        style="${s.color ? `color: ${s.color}` : ''}">
                    ${s.displayValue}
                  </span>
                  <span class="sensor-unit">${s.unit}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

        </div>
      </ha-card>
    `;

        // ── Attach Event Listeners (after DOM is built) ──────
        this._attachEventListeners();
        this._initialized = true;
    }

    _attachEventListeners() {
        const svg = this.shadowRoot.querySelector('.slider-svg');
        const icon = this.shadowRoot.querySelector('.center-icon');
        const badge = this.shadowRoot.querySelector('.preset-badge');

        if (svg && this._slider && !this._isUnavailable) {
            this._slider.svgElement = svg;
            svg.addEventListener('mousedown', (e) => this._slider.onPointerDown(e));
            svg.addEventListener('touchstart', (e) => this._slider.onPointerDown(e), { passive: false });
        }

        if (icon) {
            icon.addEventListener('click', () => this._togglePower());
        }

        if (badge) {
            badge.addEventListener('click', (e) => {
                e.stopPropagation();
                this._cyclePreset();
            });
        }
    }

    // ── Card API ───────────────────────────────────────────

    getCardSize() {
        return 4;
    }

    static getConfigElement() {
        // TODO: Implement visual config editor
        return undefined;
    }

    static getStubConfig() {
        return {
            entity: 'fan.ventosync_hrv',
            name: 'VentoSync',
            sensors: {
                co2: 'sensor.ventosync_effektiver_co2_wert',
                temperature: 'sensor.ventosync_scd41_temperatur',
                humidity: 'sensor.ventosync_scd41_luftfeuchtigkeit',
            },
        };
    }
}

// ── Register ─────────────────────────────────────────────
customElements.define(CARD_TAG, VentoSyncCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: CARD_TAG,
    name: CARD_NAME,
    description: CARD_DESCRIPTION,
    preview: true,
    documentationURL: 'https://github.com/thomasengeroff-dotcom/ventosync-card',
});