
# Egg Incubator Desktop Control System

A modern, full-stack desktop application for monitoring and controlling an egg incubator. Built with React, TypeScript, and Tauri for the frontend, and Python Flask for the backend. The system supports real-time sensor monitoring, actuator control, configuration management, and data logging, with cloud integration via Supabase.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Frontend](#frontend)
- [Backend](#backend)
- [Supabase & Data Model](#supabase--data-model)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- **Live Dashboard:** Real-time temperature, humidity, and system status monitoring.
- **Automatic & Manual Modes:** Switch between fully automated control and manual actuator overrides.
- **Egg Type Presets:** Select and apply optimal settings for different egg types (chicken, quail, duck, turkey, etc).
- **Configuration Management:** Fine-tune temperature, humidity, rotation, and ventilation parameters.
- **Logs & History:** View and export system logs and historical data.
- **Settings:** Manage serial connection, security, backup, and application preferences.
- **Cloud Sync:** Sensor data is stored and retrieved from Supabase for persistence and analytics.
- **Desktop App:** Runs as a native desktop app via Tauri, with optional web mode.

---

## Architecture

```
┌──────────────┐      Serial/USB/HTTP     ┌──────────────┐      REST API      ┌──────────────┐
│  Incubator   │ ───────────────────────▶│    Flask      │ ────────────────▶ │  Supabase    │
│  Hardware    │                          │   Backend    │                  │  Cloud DB    │
└──────────────┘                          └──────────────┘                  └──────────────┘
                                                                     ▲   ▲
                                                                     │   │
                                    HTTP/IPC              │   │
                                                                     │   │
                                                            ┌──────────────┐
                                                            │  Desktop app │
                                                            │   Frontend   │
                                                            └──────────────┘
```

---

## Project Structure

```
desktop-app/
   ├── tauriApp/
   │   ├── src/                   # React frontend (pages, components, hooks, contexts)
   │   ├── src-tauri/             # Tauri + Python backend
   │   │   ├── server/            # Flask backend, routes, utils, integration
   │   │   ├── gen/schemas/       # Tauri/desktop schemas
   │   │   └── ...
   │   ├── public/
   │   ├── package.json           # Frontend dependencies/scripts
   │   └── ...
   └── EggIncubator_0.1.0_x64_en-US.msi  # Windows installer (if built)
```

---

## Frontend

- **Tech Stack:** React, TypeScript, Tailwind CSS, React Router, TanStack Query, Supabase JS, Tauri
- **Location:** `desktop-app/tauriApp/src/`
- **Key Pages:**
   - **Dashboard:** Live sensor data, actuator status, and trends
   - **Configuration:** Set thresholds and timings for all incubator systems
   - **Manual Control:** Directly operate actuators (fan, heater, water valve, rotation)
   - **Automatic Mode:** Enable/disable and configure automatic control systems
   - **Egg Type Selection:** Presets for different egg types
   - **Logs & History:** Filterable, exportable logs
   - **Settings:** Serial port, security, backup, and preferences
- **State Management:** React Contexts for control mode and egg type
- **API Integration:** All backend and Supabase calls are wrapped in `src/hooks/use-api.js`

---

## Backend

- **Tech Stack:** Python 3.11+, Flask, Flask-CORS, PySerial, Supabase Python Client
- **Location:** `desktop-app/tauriApp/src-tauri/server/`
- **Key Components:**
   - **app.py:** Main Flask app, API endpoints, background workers, mode control
   - **routes/api.py:** `/api/data` endpoint for latest sensor data
   - **utils/serial_reader.py:** Serial or simulated data reader
   - **utils/auto.py:** Automatic control loop using targets from Supabase
   - **utils/controller.py:** Fan/Heater/Motor actions and status helpers
   - **integration/supabase.py:** Python Supabase client
- **API Endpoints:** See [API Reference](#api-reference)

---

## Supabase & Data Model

- **Supabase:** Used for storing sensor data and egg configuration for analytics and persistence
- **Tables:**
   - `sensor_data`: { temperature (float), humidity (float), created_at (timestamp) }
   - `egg_info`: { egg_type (text, pk/unique), target_temp (float), target_hum (float), rotation_interval (int, optional) }
- **Integration:**
   - Frontend: `src/integration/supabase/supabase.js`
   - Backend: `src-tauri/server/integration/supabase.py`

---

## Setup & Installation

### Prerequisites

- Node.js 18+
- Python 3.11+
- Rust toolchain (for Tauri desktop build)
- Supabase project (get URL and anon/service key)
- (Optional) Physical incubator hardware with serial output

### Environment Variables

- **Frontend:**
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your environment or `.env` file
- **Backend:**
   - Set `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in `src-tauri/server/integration/.env`

### Backend Setup

1. Install dependencies:
    ```powershell
    cd desktop-app/tauriApp/src-tauri/server
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt
    ```
2. Add your Supabase credentials to `integration/.env`
3. Run the backend:
    ```powershell
    python app.py
    ```

### Frontend Setup

1. Install dependencies:
    ```powershell
    cd desktop-app/tauriApp
    npm install
    ```
2. Add your Supabase credentials to `.env` or directly in `src/integration/supabase/supabase.js`
3. Run the frontend:
    ```powershell
    npm run dev
    ```
4. (Optional) Build and run as a desktop app:
    ```powershell
    npm run desktop
    ```

---

## Usage

- Access the frontend at [http://localhost:5173](http://localhost:5173) (or as a desktop app)
- Backend API runs at [http://localhost:3000](http://localhost:3000)
- Use the dashboard for live monitoring, and navigate through the sidebar for configuration, control, and logs

---

## API Reference

**Base URL:** `http://localhost:3000`

- `POST /api/settings` — Start background data reader (serial or HTTP)
- `GET /api/status` — Get current connection status
- `POST /api/controlMode` — Switch between 'automatic' and 'manual' modes
- `POST /api/EggType` — Set current egg type
- `GET /api/EggType` — Get current egg type
- `POST /handle_motor_action` — Control motor (body: `{ action: 'active' | 'stop' }`)
- `POST /handle_heater_action` — Control heater (body: `{ action: 'active' | 'stop' }`)
- `POST /handle_fan_action` — Control fan (body: `{ action: 'active' | 'stop' }`)
- `GET /api/data` — Get latest sensor data

---

## Troubleshooting

- **500 on `/api/controlMode`:** Ensure request body is a string `'automatic'|'manual'` or JSON with `controlMode`
- **Supabase errors:** Confirm table names and credentials
- **Simulation mode:** On serial failure, backend prompts to switch; for headless runs, set `use_simulation=True` in `serial_reader.py`
- **Automatic mode thread:** Use `/api/controlMode` endpoint to start/stop

---

## License

MIT License

## Backend

- **Tech Stack:** Python, Flask, Flask-CORS, PySerial, Supabase Python Client.
- **Location:** `server/`
- **Key Components:**
  - **Serial Reader:** Reads sensor data from the incubator via serial port. Falls back to simulation if hardware is unavailable.
  - **API Endpoint:** `/api/data` returns the latest sensor readings as JSON.
  - **Supabase Integration:** Periodically saves sensor data to Supabase.
  - **Configuration:** All dependencies listed in `server/requirements.txt`.

---

## Database

- **Supabase:** Used for storing sensor data and enabling cloud-based analytics and persistence.
- **Tables:** At minimum, a `sensor_data` table with fields for temperature and humidity.

---

## Setup & Installation

### Prerequisites

- Node.js (for frontend)
- Python 3.10+ (for backend)
- [Supabase account](https://supabase.com/) (for cloud storage)
- (Optional) Physical incubator hardware with serial output

### Backend

1. **Install dependencies:**
   ```bash
   cd server
   python -m venv venv
   venv\Scripts\activate  # On Windows
   pip install -r requirements.txt
   ```

2. **Configure Supabase:**
   - Set your Supabase URL and API key in `server/utils/serial_reader.py`.

3. **Run the backend:**
   ```bash
   python app.py
   ```

### Frontend

1. **Install dependencies:**
   ```bash
   cd ..
   npm install
   ```

2. **Configure Supabase:**
   - Set your Supabase URL and API key in `src/integration/supabase/supabase.js`.

3. **Run the frontend:**
   ```bash
   npm run dev
   ```

---

## Usage

- Access the frontend at [http://localhost:3000](http://localhost:3000).
- The backend API runs by default on [http://localhost:5000](http://localhost:5000).
- Use the dashboard for live monitoring, and navigate through the sidebar for configuration, control, and logs.

---

## Project Structure

```
website/
  ├── server/                # Python Flask backend
  │   ├── app.py
  │   ├── requirements.txt
  │   ├── routes/
  │   │   └── api.py
  │   └── utils/
  │       └── serial_reader.py
  ├── src/                   # React frontend
  │   ├── App.tsx
  │   ├── index.css
  │   ├── components/
  │   ├── pages/
  │   └── integration/
  │       └── supabase/
  │           └── supabase.js
  └── ...
```

---

## License

This project is licensed under the MIT License. 
