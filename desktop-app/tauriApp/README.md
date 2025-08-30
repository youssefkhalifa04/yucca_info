# MD-Tauri Incubator Controller

A desktop web app (React + Tauri) with a Flask backend for controlling an egg incubator. It streams sensor data (serial or simulated), stores analytics in Supabase, and supports manual and automatic control modes.

## Contents
- Overview
- Architecture
- Prerequisites
- Environment setup
- Running the project
- API reference
- Data model
- Automatic mode logic (summary)
- Troubleshooting

## Overview
- Frontend (React/TypeScript) under `src/` renders Dashboard, Configuration, Manual/Automatic control, Egg selection, Logs and Settings.
- Backend (Flask) under `src-tauri/server/` exposes REST APIs, reads serial data or simulated data, and writes to Supabase.
- Supabase stores `sensor_data` and egg configuration (`egg_info`).

## Architecture
- Frontend
  - Hooks: `src/hooks/use-api.js` wraps calls to the backend and Supabase.
  - Pages: `Dashboard`, `Configuration`, `ManualControl`, `AutomaticMode`, `EggTypeSelection`, `LogsHistory`, `Settings`.
  - Contexts: `ControlModeContext`, `EggTypeContext` (used by `Index.tsx`).
- Backend
  - `src-tauri/server/app.py`: Flask app, routes, background workers and mode control.
  - `src-tauri/server/utils/serial_reader.py`: Handles serial port reading or simulated data.
  - `src-tauri/server/utils/auto.py`: Automatic control loop using targets from Supabase.
  - `src-tauri/server/utils/controller.py`: Fan/Heater/Motor actions and status helpers.
- Supabase
  - Client integrations in both frontend and backend (`integration.supabase`).

## Prerequisites
- Node.js 18+
- Python 3.11+
- Tauri prerequisites (Rust toolchain) if packaging as a desktop app
- Supabase project and service role/key

## Environment setup
Create and fill these environment variables/files:

Frontend (Vite or CRA):
- `src/integration/supabase/supabase` should initialize the JS Supabase client using env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Backend (Python):
- `src-tauri/server/integration/supabase.py` should initialize the Python Supabase client using env vars:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY`

Example (Python) minimal:
```python
from supabase import create_client
import os
supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_KEY'])
```

## Running the project
1) Start the backend (Flask):
- From repo root:
```bash
python src-tauri/server/app.py
```
- The backend runs at `http://localhost:3000`.

2) Start the frontend (React):
- From repo root (or frontend root if different):
```bash
npm install
npm run dev
```
- Open the app in your browser (typically `http://localhost:5173`).

3) Serial vs Simulated data
- When serial connection fails, the backend prompts to switch to simulation. If running non-interactively, set your own logic to force simulation mode in `serial_reader.py`.

## API reference (Backend)
Base URL: `http://localhost:3000`

- POST `/api/settings`
  - Body: JSON with `serialPort`, `baudRate`, `connectionType` ('serial' or 'http')
  - Starts the background data reader thread.
  - Returns: `{ message, settings }`

- GET `/api/status`
  - Returns current connection status. In simulation returns `{ status: "Connected (Simulation Mode)" }`.

- POST `/api/controlMode`
  - Body: either a JSON string or object. Accepts:
    - Plain string: `'automatic'` or `'manual'`
    - Object: `{ controlMode: 'automatic' }`
  - Starts/stops the automatic control thread accordingly.
  - Returns: `{ mode }`

- POST `/api/EggType`
  - Body: `{ id: '<egg_type>' }` (e.g., `'chicken'`)
  - Persists the current egg selection in memory.
  - Returns: `{ message, egg }`

- GET `/api/EggType`
  - Returns `{ egg: '<current_egg_type>' }`.

- POST `/handle_motor_action`
  - Body: `{ action: 'active' | 'stop' }`

- POST `/handle_heater_action`
  - Body: `{ action: 'active' | 'stop' }`

- POST `/handle_fan_action`
  - Body: `{ action: 'active' | 'stop' }`

## Data model
- Supabase tables:
  - `sensor_data`:
    - `temperature` (float)
    - `humidity` (float)
    - `created_at` (timestamp, default now)
  - `egg_info`:
    - `egg_type` (text, pk or unique)
    - `target_temp` (float)
    - `target_hum` (float)
    - Optionally `rotation_interval` (int)

## Automatic mode logic (summary)
- Egg target values are fetched from Supabase `egg_info` for the selected `egg_type`.
- The automatic loop monitors `latest_data` (`temperature`, `humidity`).
- If temperature is above target: engage fan, stop heater until it drops to target.
- If temperature is below target: stop fan, engage heater until it rises to target.
- If humidity below target: call `hum_increase(...)`; if above and rising, call `hum_decrease(...)`.
- The loop runs in a background thread and can be stopped via `controlMode` endpoint (switch to manual).

## Frontend integration
- `src/pages/Index.tsx` wires contexts and `useApi` calls:
  - Sends control mode via `SendMode(mode)`.
  - Sends egg type on change via `sendEggType(currentEggType)`.
- `src/hooks/use-api.js`:
  - `getAnalytics()` reads latest `sensor_data` from Supabase.
  - `sendSettings(settings)` posts to backend to start IO.
  - `getCurrentAutoSettings(egg)` reads targets from Supabase.
  - `sendEggType(egg)` posts current egg type to backend.
  - `SendMode(mode)` posts control mode to backend.

## Troubleshooting
- 500 on `/api/controlMode`: ensure the request body is a string `'automatic'|'manual'` or JSON with `controlMode`. Server now handles both.
- `connected` appears false in `app.py`: import the module (`import utils.serial_reader as serial_reader`) and read `serial_reader.connected` so updates reflect.
- Supabase table errors: confirm table name `egg_info` (not `egg_type`).
- Python Supabase calls are synchronous: don’t `await` `.execute()`.
- Automatic mode thread: use the provided start/stop via `/api/controlMode` instead of manually manipulating threads.
- Simulation mode: On serial failure the server asks to switch; for headless runs, modify `serial_reader.py` to set `use_simulation=True` and skip `input()`.

## Scripts (suggested)
Consider adding npm scripts and Python entry points for convenience. Example:
```json
{
  "scripts": {
    "dev": "vite",
    "server": "python src-tauri/server/app.py"
  }
}
```

## License
MIT (or your preferred license). 