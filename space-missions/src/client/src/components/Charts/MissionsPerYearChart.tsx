import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getMissionsByYear } from "../../api/missionsApi";

const START_YEAR = 1957;
const END_YEAR = new Date().getFullYear();

export default function MissionsPerYearChart() {
  const [data, setData] = useState<{ year: number; missions: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const years = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);
    Promise.all(years.map((y) => getMissionsByYear(y).then((count) => ({ year: y, missions: count }))))
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="card">
      <p className="card-title">Missions Per Year</p>
      <p className="chart-placeholder">Loading…</p>
    </div>
  );

  if (error) return (
    <div className="card">
      <p className="card-title">Missions Per Year</p>
      <p className="chart-placeholder">Failed to load data.</p>
    </div>
  );

  return (
    <div className="card">
      <p className="card-title">Missions Per Year</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ left: 0, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
          <XAxis dataKey="year" tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} interval={9} />
          <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 6 }}
            itemStyle={{ color: "#e6edf3" }}
          />
          <Line type="monotone" dataKey="missions" stroke="#58a6ff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
