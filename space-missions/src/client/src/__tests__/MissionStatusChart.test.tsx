import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import MissionStatusChart from '../components/Charts/MissionStatusChart';
import { server } from '../mocks/server';
import {
  mockStatusCountsUnknownKey,
  mockStatusCountsWithZero,
} from '../mocks/handlers';

describe('MissionStatusChart', () => {
  test('shows loading placeholder on initial render', () => {
    render(<MissionStatusChart />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  test('renders chart after data loads', async () => {
    render(<MissionStatusChart />);
    await screen.findByTestId('mock-ResponsiveContainer');
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });

  test('shows error placeholder on API failure', async () => {
    server.use(
      http.get('http://localhost:5136/api/getMissionStatusCount', () =>
        HttpResponse.error(),
      ),
    );
    render(<MissionStatusChart />);
    await screen.findByText('Failed to load data.');
  });

  test('filters out zero-count statuses (filter v > 0 false branch)', async () => {
    server.use(
      http.get('http://localhost:5136/api/getMissionStatusCount', () =>
        HttpResponse.json(mockStatusCountsWithZero),
      ),
    );
    render(<MissionStatusChart />);
    await screen.findByTestId('mock-ResponsiveContainer');
    expect(screen.getByText('Mission Outcomes')).toBeInTheDocument();
  });

  test('unknown status name exercises COLORS fallback branch', async () => {
    server.use(
      http.get('http://localhost:5136/api/getMissionStatusCount', () =>
        HttpResponse.json(mockStatusCountsUnknownKey),
      ),
    );
    render(<MissionStatusChart />);
    await screen.findByTestId('mock-ResponsiveContainer');
    expect(screen.getByText('Mission Outcomes')).toBeInTheDocument();
  });
});
