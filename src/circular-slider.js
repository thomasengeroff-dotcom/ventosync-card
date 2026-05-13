// src/circular-slider.js
// ============================================================
// VentoSync Card – Circular Slider Module
// Pure geometry + pointer handling. No HA dependencies.
// Renders an SVG arc slider with discrete step ticks.
// ============================================================

import { SLIDER_DEFAULTS, STEP_COUNT } from './constants.js';

// ── Math Helpers ───────────────────────────────────────────

/**
 * Convert degrees to radians, with 0° at top (12 o'clock).
 */
function degToRad(deg) {
    return ((deg - 90) * Math.PI) / 180;
}

/**
 * Get cartesian coordinates for a point on a circle.
 */
function polarToXY(cx, cy, r, angleDeg) {
    const rad = degToRad(angleDeg);
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
}

/**
 * Describe an SVG arc path between two angles.
 */
function describeArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToXY(cx, cy, r, endAngle);
    const end = polarToXY(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

// ── Exported Slider Class ──────────────────────────────────

export class CircularSlider {
    /**
     * @param {object} options
     * @param {number} options.radius       – Arc radius in SVG units
     * @param {number} options.strokeWidth  – Arc stroke width
     * @param {number} options.arcStart     – Start angle in degrees (0° = top)
     * @param {number} options.arcEnd       – End angle in degrees
     * @param {number} options.steps        – Number of discrete steps (e.g. 10)
     * @param {function} options.onValueChange – Callback(step) during drag
     * @param {function} options.onValueCommit – Callback(step) on drag end
     */
    constructor(options = {}) {
        this.radius = options.radius ?? SLIDER_DEFAULTS.radius;
        this.strokeWidth = options.strokeWidth ?? SLIDER_DEFAULTS.strokeWidth;
        this.arcStart = options.arcStart ?? SLIDER_DEFAULTS.arcStart;
        this.arcEnd = options.arcEnd ?? SLIDER_DEFAULTS.arcEnd;
        this.steps = options.steps ?? STEP_COUNT;
        this.onValueChange = options.onValueChange ?? (() => { });
        this.onValueCommit = options.onValueCommit ?? (() => { });

        // Computed
        this.padding = SLIDER_DEFAULTS.padding;
        this.size = (this.radius + this.strokeWidth + this.padding) * 2;
        this.cx = this.size / 2;
        this.cy = this.size / 2;

        // State
        this._isDragging = false;
        this._currentStep = 0;
        this._svgElement = null;

        // Bind handlers once for clean add/remove
        this._handlePointerMove = this._onPointerMove.bind(this);
        this._handlePointerUp = this._onPointerUp.bind(this);
    }

    // ── Public API ─────────────────────────────────────────

    /** Set the current step without triggering callbacks. */
    set value(step) {
        this._currentStep = Math.max(0, Math.min(this.steps, Math.round(step)));
    }

    get value() {
        return this._currentStep;
    }

    get isDragging() {
        return this._isDragging;
    }

    /** Store reference to the SVG element for coordinate mapping. */
    set svgElement(el) {
        this._svgElement = el;
    }

    // ── Geometry ───────────────────────────────────────────

    /** Convert a step (0–N) to an angle on the arc. */
    stepToAngle(step) {
        const pct = step / this.steps;
        return this.arcStart + pct * (this.arcEnd - this.arcStart);
    }

    /** Convert an angle to the nearest step. */
    angleToStep(angle) {
        let normalized = angle;
        while (normalized < this.arcStart) { normalized += 360; }
        while (normalized > this.arcEnd + 30) { normalized -= 360; }
        normalized = Math.max(this.arcStart, Math.min(this.arcEnd, normalized));

        const pct = (normalized - this.arcStart) / (this.arcEnd - this.arcStart);
        const raw = pct * this.steps;
        return Math.max(0, Math.min(this.steps, Math.round(raw)));
    }

    /** Get {x, y} for a step on the arc. */
    stepToXY(step) {
        return polarToXY(this.cx, this.cy, this.radius, this.stepToAngle(step));
    }

    /** Get the SVG path string for the background track arc. */
    getTrackPath() {
        return describeArc(this.cx, this.cy, this.radius, this.arcStart, this.arcEnd);
    }

    /** Get the SVG path string for the active (filled) arc. */
    getActivePath(step) {
        if (step <= 0) { return ''; }
        const angle = this.stepToAngle(step);
        return describeArc(this.cx, this.cy, this.radius, this.arcStart, angle);
    }

    /**
     * Get background track arc for an inner ring at `innerRadius`.
     * @param {number} innerRadius – Radius in SVG units
     */
    getInnerTrackPath(innerRadius) {
        return describeArc(this.cx, this.cy, innerRadius, this.arcStart, this.arcEnd);
    }

    /**
     * Get filled arc for an inner ring at `innerRadius` for a given fraction (0–1).
     * @param {number} innerRadius – Radius in SVG units
     * @param {number} fraction – Value between 0 and 1
     */
    getInnerArcPath(innerRadius, fraction) {
        if (fraction <= 0) { return ''; }
        const clampedFraction = Math.min(1, Math.max(0, fraction));
        const angle = this.arcStart + clampedFraction * (this.arcEnd - this.arcStart);
        return describeArc(this.cx, this.cy, innerRadius, this.arcStart, angle);
    }

    /**
     * Get an arc segment between two fractions (0-1).
     * @param {number} innerRadius - Radius in SVG units
     * @param {number} startFraction - Start fraction (0-1)
     * @param {number} endFraction - End fraction (0-1)
     */
    getInnerArcSegmentPath(innerRadius, startFraction, endFraction) {
        const clamp = (val) => Math.min(1, Math.max(0, val));
        const start = clamp(startFraction);
        const end = clamp(endFraction);
        if (start >= end) { return ''; }

        const startAngle = this.arcStart + start * (this.arcEnd - this.arcStart);
        const endAngle = this.arcStart + end * (this.arcEnd - this.arcStart);
        
        return describeArc(this.cx, this.cy, innerRadius, startAngle, endAngle);
    }

    /** Get {x, y} for the thumb at a given step. */
    getThumbPosition(step) {
        return this.stepToXY(step);
    }

    /**
     * Get tick mark data for all steps.
     * Returns array of { x1, y1, x2, y2, step, isMajor }.
     */
    getTicks() {
        const ticks = [];
        const innerOffset = this.strokeWidth + 6;
        const outerOffset = this.strokeWidth + 2;

        for (let i = 0; i <= this.steps; i++) {
            const angle = this.stepToAngle(i);
            const inner = polarToXY(this.cx, this.cy, this.radius - innerOffset, angle);
            const outer = polarToXY(this.cx, this.cy, this.radius - outerOffset, angle);

            ticks.push({
                x1: inner.x,
                y1: inner.y,
                x2: outer.x,
                y2: outer.y,
                step: i,
                isMajor: i % 5 === 0,
            });
        }
        return ticks;
    }

    // ── Pointer Handling ───────────────────────────────────

    /**
     * Call this from the SVG's mousedown/touchstart.
     * @param {Event} e – Mouse or touch event
     */
    onPointerDown(e) {
        e.preventDefault();
        this._isDragging = true;

        const angle = this._getAngleFromEvent(e);
        if (angle !== null) {
            const step = this.angleToStep(angle);
            this._updateStep(step);
        }

        window.addEventListener('mousemove', this._handlePointerMove, { passive: false });
        window.addEventListener('mouseup', this._handlePointerUp);
        window.addEventListener('touchmove', this._handlePointerMove, { passive: false });
        window.addEventListener('touchend', this._handlePointerUp);
    }

    _onPointerMove(e) {
        if (!this._isDragging) { return; }
        e.preventDefault();

        const angle = this._getAngleFromEvent(e);
        if (angle !== null) {
            const step = this.angleToStep(angle);
            this._updateStep(step);
        }
    }

    _onPointerUp() {
        if (!this._isDragging) { return; }
        this._isDragging = false;

        // Commit final value
        this.onValueCommit(this._currentStep);

        window.removeEventListener('mousemove', this._handlePointerMove);
        window.removeEventListener('mouseup', this._handlePointerUp);
        window.removeEventListener('touchmove', this._handlePointerMove);
        window.removeEventListener('touchend', this._handlePointerUp);
    }

    /**
     * Extract angle from a pointer event relative to SVG center.
     * @returns {number|null} Angle in degrees (0° = top, clockwise)
     */
    _getAngleFromEvent(e) {
        if (!this._svgElement) { return null; }

        const rect = this._svgElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // atan2 gives angle from positive X axis, counter-clockwise.
        // We want angle from top (Y-), clockwise.
        let angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
        angle += 90; // Rotate so 0° = top
        if (angle < 0) { angle += 360; }

        return angle;
    }

    /**
     * Update step and fire callback if changed.
     * Also triggers haptic feedback on step change.
     */
    _updateStep(newStep) {
        if (newStep === this._currentStep) { return; }

        const oldStep = this._currentStep;
        this._currentStep = newStep;

        // Haptic feedback on step boundaries
        if (oldStep !== newStep && typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(6);
        }

        this.onValueChange(newStep);
    }

    // ── Cleanup ────────────────────────────────────────────

    /** Remove all global listeners. Call when card is disconnected. */
    destroy() {
        this._isDragging = false;
        window.removeEventListener('mousemove', this._handlePointerMove);
        window.removeEventListener('mouseup', this._handlePointerUp);
        window.removeEventListener('touchmove', this._handlePointerMove);
        window.removeEventListener('touchend', this._handlePointerUp);
        this._svgElement = null;
    }
}