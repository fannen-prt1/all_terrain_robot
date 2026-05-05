

# ROBOT-X F1 Command Center

This repo contains the **official web dashboard** (Vite + React + Tailwind + Three.js) plus the **ESP32 firmware**.

## Repository layout

- `src/`, `public/`, `index.html`, `vite.config.ts` → the dashboard (main project)
- `firmware/` → Arduino/ESP32 sketches
- `cad/solidworks/` → local CAD sources (ignored by git; not pushed)

## Run the dashboard locally

**Prerequisites:** Node.js (LTS recommended)

1. Install dependencies:
   `npm install`
2. (Optional) If you use Gemini features, set `GEMINI_API_KEY` in `.env.local`
3. Start dev server:
   `npm run dev`

The dashboard will be served on port `3000`.

## Firmware

Open sketches under `firmware/` in Arduino IDE (or PlatformIO) and upload to your ESP32.
