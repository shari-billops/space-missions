import { useState } from "react";
import type { Filters } from "../../types/mission";

const MAX_COMPANY_LENGTH = 100;
const MIN_DATE = "1957-01-01";
const TODAY = new Date().toISOString().split("T")[0];

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}

export default function FilterPanel({ filters, onChange, onReset }: Props) {
  const [dateError, setDateError] = useState("");

  const set = (key: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;

    if (key === "startDate" || key === "endDate") {
      const start = key === "startDate" ? value : filters.startDate;
      const end = key === "endDate" ? value : filters.endDate;
      if (start && end && start > end) {
        setDateError("Start date must be on or before end date.");
        return;
      }
      setDateError("");
    }

    onChange({ ...filters, [key]: value });
  };

  const trimCompany = () => {
    const trimmed = filters.company.trim();
    if (trimmed !== filters.company) onChange({ ...filters, company: trimmed });
  };

  const handleReset = () => {
    setDateError("");
    onReset();
  };

  return (
    <div className="card filter-panel">
      <p className="card-title">Filters</p>
      <div className="filter-grid">
        <label>
          <span>Company</span>
          <input
            value={filters.company}
            onChange={set("company")}
            onBlur={trimCompany}
            placeholder="e.g. SpaceX"
            maxLength={MAX_COMPANY_LENGTH}
          />
        </label>
        <label>
          <span>Mission Status</span>
          <select value={filters.missionStatus} onChange={set("missionStatus")}>
            <option value="">All</option>
            <option>Success</option>
            <option>Failure</option>
            <option>Partial Failure</option>
            <option>Prelaunch Failure</option>
          </select>
        </label>
        <label>
          <span>Rocket Status</span>
          <select value={filters.rocketStatus} onChange={set("rocketStatus")}>
            <option value="">All</option>
            <option>Active</option>
            <option>Retired</option>
          </select>
        </label>
        <label>
          <span>From</span>
          <input
            type="date"
            value={filters.startDate}
            onChange={set("startDate")}
            min={MIN_DATE}
            max={filters.endDate || TODAY}
          />
        </label>
        <label>
          <span>To</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={set("endDate")}
            min={filters.startDate || MIN_DATE}
            max={TODAY}
          />
        </label>
        <div className="filter-actions">
          <button className="btn-reset" onClick={handleReset}>Reset</button>
        </div>
      </div>
      {dateError && <p className="filter-error" role="alert">{dateError}</p>}
    </div>
  );
}
