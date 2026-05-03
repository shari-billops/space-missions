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

## Testing

Tests live in `space-missions/client/src/__tests__/` and use **Jest**, **React Testing Library**, and **MSW** for API mocking.

### Run all tests

```bash
cd space-missions/client
npm test
```

### Run with coverage report

```bash
npm run test:coverage
```

Coverage is collected for all source files under `src/` (excluding `main.tsx`, type declarations, and test infrastructure). The threshold is set to **100%** — branches, functions, lines, and statements.

### Test structure

| File | What it covers |
|---|---|
| `missionsApi.test.ts` | All 9 API functions (direct call → MSW intercept) |
| `FilterPanel.test.tsx` | Date-range validation, trim-on-blur, select/input onChange, min/max attributes |
| `SummaryStats.test.tsx` | Loading, error, data, zero-total rate, filters-active indicator |
| `MissionsTable.test.tsx` | Loading/error/empty/data states, sort cycling, pagination, null price, unknown status color |
| `MissionStatusChart.test.tsx` | Loading/error/data, zero-count filter, unknown status color fallback |
| `TopCompaniesChart.test.tsx` | Loading/error/data states |
| `MissionsPerYearChart.test.tsx` | Loading/error/data states |
| `App.test.tsx` | Full render, filter change, reset propagation |

### How it works

- **MSW** intercepts all `axios` HTTP calls at the network level — no mocking of the API module itself.
- **Recharts** is replaced with a thin component mock so tests aren't blocked by `ResizeObserver` (unavailable in jsdom) and chart internals.
- Each test file that exercises an error path uses `server.use(...)` to override the default handler for that test only; `afterEach` resets all overrides automatically.

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

## Backend Unit and Integration Testing

The backend includes separate .NET 8 test projects for unit tests and API integration tests. Run these commands from the repository root unless otherwise noted.

### Run backend unit tests

```bash
dotnet test tests/SpaceMissions.UnitTests/SpaceMissions.UnitTests.csproj
```

### Run backend integration tests

```bash
dotnet test tests/SpaceMissions.Api.IntegrationTests/SpaceMissions.Api.IntegrationTests.csproj
```

Integration tests use `Microsoft.AspNetCore.Mvc.Testing` and `WebApplicationFactory` to start the Minimal API in memory and call the API endpoints through `HttpClient`.

### Run all backend tests

```bash
dotnet test
```

### Run all backend tests with coverage

Both test projects should reference `coverlet.collector` version `6.0.2`, which is compatible with .NET 8.

```bash
dotnet test --collect:"XPlat Code Coverage"
```

Coverage files are generated under each test project's `TestResults` directory as `coverage.cobertura.xml`.

### Generate an HTML coverage report

Install ReportGenerator if you do not already have it:

```bash
dotnet tool install -g dotnet-reportgenerator-globaltool
```

If it is already installed, update it:

```bash
dotnet tool update -g dotnet-reportgenerator-globaltool
```

Generate the combined coverage report:

```bash
reportgenerator \
  -reports:"**/coverage.cobertura.xml" \
  -targetdir:"coverage-report" \
  -reporttypes:Html
```

Open the report on macOS:

```bash
open coverage-report/index.html
```

### Optional coverage script

For repeatable local coverage runs, create a `coverage.sh` script at the repository root:

```bash
#!/bin/bash
set -e

dotnet test --collect:"XPlat Code Coverage"

reportgenerator \
  -reports:"**/coverage.cobertura.xml" \
  -targetdir:"coverage-report" \
  -reporttypes:Html

open coverage-report/index.html
```

Make it executable and run it:

```bash
chmod +x coverage.sh
./coverage.sh
```

---

## AI Tooling

This project was built using **Claude Code** (Anthropic) as a development pair. Claude assisted with scaffolding, component structure, and API design. All code was reviewed, directed, and validated by the author.
