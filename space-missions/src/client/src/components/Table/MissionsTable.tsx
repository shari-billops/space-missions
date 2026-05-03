import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { getMissions } from "../../api/missionsApi";
import type { Filters, Mission } from "../../types/mission";

const STATUS_COLORS: Record<string, string> = {
  Success: "var(--success)",
  Failure: "var(--failure)",
  "Partial Failure": "var(--partial)",
  "Prelaunch Failure": "var(--prelaunch)",
};

const col = createColumnHelper<Mission>();

const columns = [
  col.accessor("date", { header: "Date", size: 100 }),
  col.accessor("company", { header: "Company", size: 130 }),
  col.accessor("name", { header: "Mission", size: 160 }),
  col.accessor("rocket", { header: "Rocket", size: 160 }),
  col.accessor("location", { header: "Location", size: 220 }),
  col.accessor("missionStatus", {
    header: "Status",
    size: 120,
    cell: (info) => (
      <span style={{ color: STATUS_COLORS[info.getValue()] ?? "inherit" }}>
        {info.getValue()}
      </span>
    ),
  }),
  col.accessor("rocketStatus", { header: "Rocket Status", size: 110 }),
  col.accessor("price", {
    header: "Price ($M)",
    size: 90,
    cell: (info) => info.getValue() ?? "—",
  }),
];

interface Props { filters: Filters }

export default function MissionsTable({ filters }: Props) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getMissions(filters)
      .then(setMissions)
      .catch(() => { setError(true); setMissions([]); })
      .finally(() => setLoading(false));
  }, [filters]);

  const table = useReactTable({
    data: missions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  return (
    <div className="card table-card">
      <div className="table-header">
        <p className="card-title">Mission Data</p>
        <span className="table-count">{missions.length.toLocaleString()} missions</span>
      </div>

      <div className="table-scroll">
        <table className="missions-table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.column.columnDef.size }}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getCanSort() ? "sortable" : /* istanbul ignore next */ ""}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" ? " ↑" : header.column.getIsSorted() === "desc" ? " ↓" : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} className="table-empty">Loading…</td></tr>
            ) : error ? (
              <tr><td colSpan={columns.length} className="table-empty">Failed to load missions.</td></tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="table-empty">No missions match the current filters.</td></tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && missions.length > 0 && (
        <div className="table-pagination">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>← Prev</button>
          <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next →</button>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            style={{ width: "auto" }}
          >
            {[25, 50, 100].map((s) => <option key={s} value={s}>{s} / page</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
