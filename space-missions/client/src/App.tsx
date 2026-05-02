import { useState } from "react";
import type { Filters } from "./types/mission";
import FilterPanel from "./components/Filters/FilterPanel";
import SummaryStats from "./components/Stats/SummaryStats";
import MissionsTable from "./components/Table/MissionsTable";
import MissionStatusChart from "./components/Charts/MissionStatusChart";
import MissionsPerYearChart from "./components/Charts/MissionsPerYearChart";
import TopCompaniesChart from "./components/Charts/TopCompaniesChart";
import "./App.css";

const defaultFilters: Filters = {
  company: "",
  missionStatus: "",
  rocketStatus: "",
  startDate: "",
  endDate: "",
};

export default function App() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-logo" aria-hidden="true">
          <span className="logo-circle c1" />
          <span className="logo-circle c2" />
          <span className="logo-circle c3" />
        </div>
        <div>
          <h1 className="header-title">Space Missions Dashboard</h1>
          <p className="header-sub">Historical launch data from 1957 onwards</p>
        </div>
      </header>

      <main className="app-main">
        <FilterPanel filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
        <SummaryStats filters={filters} />

        <section className="charts-grid">
          <MissionStatusChart />
          <TopCompaniesChart />
          <MissionsPerYearChart />
        </section>

        <MissionsTable filters={filters} />
      </main>
    </div>
  );
}
