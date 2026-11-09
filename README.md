# MechMate AI — Aerospace Machine Maintenance & Mission Reliability Platform

> **Tagline:** Physics-Informed AI Intelligence for Mission-Critical Spacecraft Components & Orbital Machinery  
> **Core Architecture:** `Observe → Understand → Reason → Simulate → Recommend → Explain`

MechMate AI is an advanced, production-grade aerospace predictive maintenance platform engineered specifically for mission-critical space infrastructure—including NASA ISAAC project systems, ISS EBF3 (Electron Beam Freeform Fabrication) hardware, life support sub-systems, and deep-space rotating machinery.

The platform bridges real-time multi-channel telemetry streams from orbit, aerospace engineering physics calculations, interactive 3D WebGL digital twins of spacecraft modules, "What-If" operational stress labs, and a root-cause reasoning engine powered by Google Gemini with deterministic engineering fallbacks.

---

## 1. System Architecture

```text
                                 ┌───────────────────────────────────────────────────┐
                                 │                MECHMATE AI CORE                   │
                                 │   • Spacecraft Store     • Telemetry Channels     │
                                 │   • Physics Equations    • Telemetry Compliance   │
                                 │   • Causal Diagnostics   • Health Index Scoring   │
                                 │   • RAG Knowledge Base   • What-If Simulator      │
                                 └─────────────────────────┬─────────────────────────┘
                                                           │
                     ┌─────────────────────────────────────┴─────────────────────────────────────┐
                     ▼                                                                           ▼
          ┌─────────────────────────┐                                                 ┌─────────────────────────┐
          │     FRONTEND (SPA)      │                                                 │    BACKEND (EXPRESS)    │
          │ • Three.js 3D Twin      │                                                 │ • Gemini Flash Copilot  │
          │ • Real-Time Telemetry   │ ◄────────── JSON REST API / WebSockets ────────►│ • Deterministic RAG     │
          │ • What-If Stress Lab    │                                                 │ • Telemetry Streaming   │
          │ • Aerospace PDF Reports │                                                 │ • Health & Diagnostics  │
          └─────────────────────────┘                                                 └─────────────────────────┘
```

### Key Technical Stack:
- **Language & Runtime:** TypeScript, Node.js
- **Frontend Framework:** React 18, Vite, Tailwind CSS
- **3D Visualization:** Three.js, WebGL (Dynamic Hotspot & Stress Shader Overlays)
- **AI & Reasoning:** Google Gemini API (`gemini-2.5-flash`), with deterministic rule-based engineering fallback
- **Aerospace & Mechanical Standards:** NASA Reliability Standards, ISO 20816 (Vibration Severity), ISO 281 (\(L_{10h}\) Bearing Life)
- **Reporting Engine:** jsPDF for instant mission-readiness audit compliance reports

---

## 2. Core Platform Capabilities

### 1. Real-Time Aerospace Telemetry Monitoring
- **Orbital Vibration Severity:** Overall velocity RMS (mm/s) evaluated strictly against microgravity and high-vibration rocket launch flight specs.
- **Thermal Footprint:** Dual-probe Drive-End (DE) and Non-Drive-End (NDE) bearing temperatures (°C) monitored to sustain strict vacuum limits.
- **Speed & Load:** Input & output shaft rotational speed (RPM), mechanical loading percentage (%), and transmitted solar electrical power (kW).
- **Tribology & Coolant:** Sump fluid temperature (°C), viscosity degradation index (%), and lubricant/coolant pressure (bar).

### 2. Interactive 3D Spacecraft Component Digital Twin
- Interactive Three.js CAD twin with orbit controls, pan, zoom, and space hardware component isolation.
- Exploded-view inspection for housing, input/output shafts, aerospace bearings, helical gear meshes, and lubrication sumps.
- Dynamic color-coded thermal & stress hotspot projection linked directly to live telemetry streams.

### 3. Physics-Informed Mechanical Calculations
- **Input/Output Shaft Torque:** \(T = 9550 \cdot \frac{P}{\text{RPM}}\) (Nm)
- **Reduction Ratio Determination:** \(i = \frac{N_{in}}{N_{out}}\) (multi-stage split verification)
- **Shaft Shear Stress Sizing:** Preliminary diameter validation using maximum torsional shear \(\tau_{allow}\) and application shock factor \(K_a\).
- **ISO 281 Bearing Life Derating:** Evaluates temperature-dependent lubrication film breakdown and viscosity ratio κ impact on \(L_{10h}\) life.

### 4. "What-If" Operational Stress Simulation
- Allows flight control teams and maintenance engineers to model non-standard operating scenarios without risking physical space hardware.
- Adjust RPM and mechanical load percentage to immediately project resulting bearing temperatures, thermal margins, and lubrication film breakdown risk.

### 5. AI Engineering Copilot
- Root-cause failure mode ranking (e.g., inner race spalling, angular misalignment, lubrication starvation, unbalance).
- Natural language query answering grounded in engineering datasheets (NASA technical briefs, SKF, and manufacturer manuals).
- Prioritized aerospace inspection plans and tool checklists.

### 6. Automated Space-Readiness Compliance Reports
- One-click export of structured engineering audit documents in PDF format.
- Includes timestamped telemetry baselines, root cause findings, component stress summaries, and mission director sign-off blocks.

---

## 3. Project Structure

```text
/
├── server.ts                       # Express backend: AI copilot proxy, health check & static hosting
├── .env.example                    # Environment configuration template
├── src/
│   ├── core/
│   │   └── calculations.ts         # Mechanical equations (Torque, Ratio, Sizing)
│   ├── ai/
│   │   └── reasoningEngine.ts      # Multi-agent orchestrator & root-cause diagnostic evaluator
│   ├── ml/
│   │   └── sensorIntelligence.ts   # Rolling statistics, Z-score anomaly detection
│   ├── components/
│   │   ├── DigitalTwin3D.tsx       # Interactive Three.js/WebGL 3D CAD digital twin
│   │   ├── AICopilotPanel.tsx      # Natural-language AI copilot panel
│   │   ├── DiagnosticsView.tsx     # Deep-dive root-cause matrix & failure modes
│   │   ├── SimulationView.tsx      # "What-If" operational stress simulator
│   │   ├── MachinesView.tsx        # Fleet overview & machine inventory
│   │   ├── KnowledgeView.tsx       # Engineering manuals & datasheet RAG library
│   │   ├── AppGuideView.tsx        # Comprehensive engineering platform manual
│   │   ├── MaintenanceAndReportsView.tsx # Work orders & compliance audit view
│   │   └── SensorTrendChart.tsx    # Live telemetry waveform & trend charts
│   ├── utils/
│   │   └── pdfGenerator.ts         # ISO audit PDF report generator
│   └── App.tsx                     # Main workstation UI and layout
```

---

## 4. Local Setup & Execution

### Prerequisites:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Configuration (Optional)
Copy `.env.example` to `.env` and add your Google Gemini API key:
```bash
GEMINI_API_KEY="your-gemini-api-key"
```
*(Note: If no API key is provided, the platform automatically switches to the built-in deterministic physics engine, guaranteeing 100% functionality offline).*

### 3. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

### 5. Code Quality & Verification
```bash
npm run lint
```
