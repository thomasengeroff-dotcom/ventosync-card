# VentoSync Card

[![HACS Validation](https://github.com/thomasengeroff-dotcom/ventosync-card/actions/workflows/validate.yml/badge.svg)](https://github.com/thomasengeroff-dotcom/ventosync-card/actions/workflows/validate.yml)
[![Release](https://img.shields.io/github/v/release/thomasengeroff-dotcom/ventosync-card?style=flat-square)](https://github.com/thomasengeroff-dotcom/ventosync-card/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![HACS: Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://hacs.xyz)

A custom Home Assistant Lovelace card for [VentoSync](https://github.com/thomasengeroff-dotcom/VentoSync) heat recovery ventilation (HRV) devices — circular fan control with real-time air quality monitoring.

<!-- TODO: Add screenshot here -->
<!-- ![VentoSync Card Screenshot](docs/screenshot.png) -->

## Features

- 🎛️ **Circular slider** with 10 haptic intensity steps
- 🏠 **Animated HRV icon** that adapts to the current operating mode
- 🌬️ **Real-time air quality** — CO₂, IAQ, temperature, humidity
- 📊 **Heat recovery efficiency** monitoring
- 👤 **Presence-aware** status indication
- 🎨 **Mode-specific themes** — Smart-Automatik, Wärmerückgewinnung, Durchlüften, Stoßlüftung
- 📱 **Touch-optimized** with snap-to-step and haptic feedback
- 🔧 **HACS compatible** for easy installation and updates

## Requirements

| Component | Version |
| :--- | :--- |
| Home Assistant | 2024.1+ |
| VentoSync Firmware | 2.0+ |
| HACS | 2.0+ (for HACS install) |

## Installation

### HACS (Recommended)

1. Open **HACS** → **Frontend**
2. Click the **⋮** menu → **Custom repositories**
3. Add `https://github.com/thomasengeroff-dotcom/ventosync-card` as **Dashboard**
4. Search for **VentoSync Card** and install it
5. **Restart Home Assistant**

### Manual

1. Download `ventosync-card.js` from the [latest release](https://github.com/thomasengeroff-dotcom/ventosync-card/releases)
2. Copy it to `/config/www/ventosync-card.js`
3. Go to **Settings** → **Dashboards** → **Resources**
4. Add `/local/ventosync-card.js` as **JavaScript Module**
5. **Restart Home Assistant**

## Configuration

### Minimal

```yaml
type: custom:ventosync-card
entity: fan.ventosync_hrv
```

### Full

```yaml
type: custom:ventosync-card
entity: fan.ventosync_hrv
name: Schlafzimmer
# Optional sensor entities for the info panel
sensors:
  co2: sensor.ventosync_effektiver_co2_wert
  temperature: sensor.ventosync_scd41_temperatur
  humidity: sensor.ventosync_scd41_luftfeuchtigkeit
  iaq: sensor.ventosync_bme680_luftqualitat_co2eq
  pressure: sensor.ventosync_bmp390_luftdruck
  supply_temp: sensor.ventosync_wrg_temperatur_zuluft_innen
  exhaust_temp: sensor.ventosync_wrg_temperatur_abluft_aussen
  heat_recovery: sensor.ventosync_wrg_effizienz
  presence: binary_sensor.ventosync_radar_anwesenheit

# Display options
show_sensors:
  - co2
  - temperature
  - humidity
  - heat_recovery
```

### Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `entity` | string | **required** | Fan entity ID |
| `name` | string | Entity name | Display name |
| `sensors` | object | `{}` | Map of sensor entity IDs |
| `show_sensors` | list | all | Which sensors to display |
| `icon_url` | string | built-in | Custom SVG icon URL |

## Supported Entities

This card is designed to work with VentoSync's ESPHome `fan` entity:

- **Fan speed:** 10 discrete steps via `speed_count: 10`
- **Preset modes:** Smart-Automatik, Wärmerückgewinnung, Durchlüften, Stoßlüftung

All sensor data is read from separate sensor entities — the card is not limited by the fan entity's attributes.

## Development

```bash
# Clone the repo
git clone https://github.com/thomasengeroff-dotcom/ventosync-card.git
cd ventosync-card

# Install dependencies
npm install

# Development build with hot reload
npm run watch

# Production build
npm run build

# Lint
npm run lint
```

### Local testing

1. Run `npm run watch`
2. Symlink or copy `dist/ventosync-card.js` to your HA `/config/www/` folder
3. Add as resource in HA and refresh

## Related Projects

- **[VentoSync](https://github.com/thomasengeroff-dotcom/VentoSync)** — ESPHome firmware for the VentoSync HRV device

## License

[MIT](LICENSE) © Thomas Engeroff
