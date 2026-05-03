import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getTopCompanies } from "../../api/missionsApi";
import type { TopCompany } from "../../types/mission";

export default function TopCompaniesChart() {
  const [data, setData] = useState<TopCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getTopCompanies(10)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="card">
      <p className="card-title">Top 10 Companies by Missions</p>
      <p className="chart-placeholder">Loading…</p>
    </div>
  );

  if (error) return (
    <div className="card">
      <p className="card-title">Top 10 Companies by Missions</p>
      <p className="chart-placeholder">Failed to load data.</p>
    </div>
  );

  return (
    <div className="card">
      <p className="card-title">Top 10 Companies by Missions</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis type="number" tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="company" tick={{ fill: "#8b949e", fontSize: 11 }} width={90} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 6 }}
            itemStyle={{ color: "#e6edf3" }}
            cursor={{ fill: "rgba(88,166,255,0.08)" }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={`hsl(${210 - i * 12}, 80%, ${65 - i * 2}%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
