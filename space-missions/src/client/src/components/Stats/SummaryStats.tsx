import { useEffect, useState } from "react";
import { getMissionStatusCount } from "../../api/missionsApi";
import type { Filters, MissionStatusCounts } from "../../types/mission";

interface Props { filters: Filters }

export default function SummaryStats({ filters }: Props) {
  const [counts, setCounts] = useState<MissionStatusCounts | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMissionStatusCount().then(setCounts).catch(() => setError(true));
  }, []);

  if (error) return (
    <div className="stats-row">
      <div className="card stat-card">
        <div className="stat-label">Failed to load statistics.</div>
      </div>
    </div>
  );

  if (!counts) return null;

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const rate = total > 0 ? ((counts.Success / total) * 100).toFixed(2) : "0.00";
  const active = filters.company || filters.missionStatus || filters.rocketStatus || filters.startDate || filters.endDate;

  return (
    <div className="stats-row">
      <StatCard label="Total Missions" value={total.toLocaleString()} />
      <StatCard label="Successful" value={counts.Success.toLocaleString()} color="var(--success)" />
      <StatCard label="Failed" value={counts.Failure.toLocaleString()} color="var(--failure)" />
      <StatCard label="Partial Failure" value={counts["Partial Failure"].toLocaleString()} color="var(--partial)" />
      <StatCard label="Overall Success Rate" value={`${rate}%`} color="var(--accent)" />
      {active && <StatCard label="Filters Active" value="✓" color="var(--accent)" />}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="card stat-card">
      <div className="stat-value" style={{ color: color ?? "var(--text)" }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
