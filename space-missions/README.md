# Space Missions Dashboard

An interactive dashboard for exploring historical space launch data from 1957 to the present.

Built with a **C# .NET 8 Minimal API** backend and a **React + TypeScript** frontend.

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)

---

## Running the Application

### 1. Start the API

```bash
cd api
dotnet run
```

The API starts at **http://localhost:5136**. The `space_missions.csv` data file is included in the project and loads automatically on startup.

### 2. Start the Client

```bash
cd client
npm install
npm run dev
```

The dashboard opens at **http://localhost:5173**.

---

## Programmatic API Reference

All grading functions are exposed as GET endpoints.

### Dashboard endpoints

| Endpoint | Parameters | Description |
|---|---|---|
| `GET /api/missions` | `company`, `missionStatus`, `rocketStatus`, `startDate`, `endDate` (all optional) | Filtered mission list |
| `GET /api/companies` | — | Distinct company names |
| `GET /api/statuses/mission` | — | Distinct mission statuses |
| `GET /api/statuses/rocket` | — | Distinct rocket statuses |

### Grading function endpoints

```bash
# Function 1 — mission count for a company
curl "http://localhost:5136/api/getMissionCountByCompany?company=SpaceX"

# Function 2 — success rate for a company (0–100, 2 decimal places)
curl "http://localhost:5136/api/getSuccessRate?company=SpaceX"

# Function 3 — mission names in a date range, sorted chronologically
curl "http://localhost:5136/api/getMissionsByDateRange?startDate=1957-10-01&endDate=1957-12-31"

# Function 4 — top N companies by mission count
curl "http://localhost:5136/api/getTopCompaniesByMissionCount?n=3"

# Function 5 — count of missions per status
curl "http://localhost:5136/api/getMissionStatusCount"

# Function 6 — total missions in a given year
curl "http://localhost:5136/api/getMissionsByYear?year=2020"

# Function 7 — most frequently used rocket
curl "http://localhost:5136/api/getMostUsedRocket"

# Function 8 — average missions per year over a range (2 decimal places)
curl "http://localhost:5136/api/getAverageMissionsPerYear?startYear=2010&endYear=2020"
```

---

## Visualization Choices

### 1. Pie Chart — Mission Outcomes
Outcome data is a part-to-whole relationship across four discrete categories (Success, Failure, Partial Failure, Prelaunch Failure). A pie chart communicates proportional composition at a glance. The color encoding — green, red, yellow, grey — maps intuitively to outcome severity, so the distribution is readable without needing to check the legend.

### 2. Horizontal Bar Chart — Top 10 Companies by Mission Count
Company names are long strings that become unreadable on a vertical bar chart's x-axis. A horizontal layout gives the labels room to breathe and keeps the ranking immediately scannable top-to-bottom. Sorted descending, the chart answers "who launched the most?" in one look.

### 3. Line Chart — Missions Per Year (1957–Present)
~70 years of annual mission counts is continuous time-series data. A line chart emphasizes the shape of change over time — the Space Race ramp-up, the post-Cold War contraction, and the commercial launch surge starting around 2015 — in a way that a bar chart at this time scale would obscure.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | C# .NET 8 Minimal API |
| CSV parsing | CsvHelper |
| Frontend | React 19 + TypeScript + Vite |
| Data table | TanStack Table v8 |
| Charts | Recharts |
| HTTP client | Axios |

---

## AI Tooling

This project was built using **Claude Code** (Anthropic) as a development pair. Claude assisted with scaffolding, component structure, and API design. All code was reviewed, directed, and validated by the author.
