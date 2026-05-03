import React from 'react';

type WithChildren = { children?: React.ReactNode; [key: string]: unknown };

const passthrough =
  (name: string): React.FC<WithChildren> =>
  ({ children }) =>
    <div data-testid={`mock-${name}`}>{children}</div>;

export const ResponsiveContainer = passthrough('ResponsiveContainer');
export const PieChart = passthrough('PieChart');
export const Pie = passthrough('Pie');
export const BarChart = passthrough('BarChart');
export const Bar = passthrough('Bar');
export const LineChart = passthrough('LineChart');
export const Line = passthrough('Line');

export const Cell: React.FC<{ fill?: string; [key: string]: unknown }> = () => null;
export const XAxis: React.FC<Record<string, unknown>> = () => null;
export const YAxis: React.FC<Record<string, unknown>> = () => null;
export const Tooltip: React.FC<Record<string, unknown>> = () => null;
export const Legend: React.FC<Record<string, unknown>> = () => null;
export const CartesianGrid: React.FC<Record<string, unknown>> = () => null;
