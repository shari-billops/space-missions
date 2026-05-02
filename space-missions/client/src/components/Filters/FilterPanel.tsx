import type { Filters } from "../../types/mission";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}

export default function FilterPanel({ filters, onChange, onReset }: Props) {
  const set = (key: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="card filter-panel">
      <p className="card-title">Filters</p>
      <div className="filter-grid">
        <label>
          <span>Company</span>
          <input value={filters.company} onChange={set("company")} placeholder="e.g. SpaceX" />
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
          <input type="date" value={filters.startDate} onChange={set("startDate")} />
        </label>
        <label>
          <span>To</span>
          <input type="date" value={filters.endDate} onChange={set("endDate")} />
        </label>
        <div className="filter-actions">
          <button className="btn-reset" onClick={onReset}>Reset</button>
        </div>
      </div>
    </div>
  );
}
