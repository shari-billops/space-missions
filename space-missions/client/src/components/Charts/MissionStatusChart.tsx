import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getMissionStatusCount } from "../../api/missionsApi";
import type { MissionStatusCounts } from "../../types/mission";

const COLORS: Record<string, string> = {
  Success: "#3fb950",
  Failure: "#f85149",
  "Partial Failure": "#d29922",
  "Prelaunch Failure": "#8b949e",
};

export default function MissionStatusChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    getMissionStatusCount().then((counts: MissionStatusCounts) => {
      setData(
        Object.entries(counts)
          .filter(([, v]) => v > 0)
          .map(([name, value]) => ({ name, value }))
      );
    });
  }, []);

  return (
    <div className="card">
      <p className="card-title">Mission Outcomes</p>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={false}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] ?? "#58a6ff"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 6 }}
            itemStyle={{ color: "#e6edf3" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#8b949e" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
