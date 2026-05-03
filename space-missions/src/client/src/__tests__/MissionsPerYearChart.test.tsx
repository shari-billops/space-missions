import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import MissionsPerYearChart from '../components/Charts/MissionsPerYearChart';
import { server } from '../mocks/server';

describe('MissionsPerYearChart', () => {
  test('shows loading placeholder on initial render', () => {
    render(<MissionsPerYearChart />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  test('renders chart after all year data loads', async () => {
    render(<MissionsPerYearChart />);
    await screen.findByTestId('mock-ResponsiveContainer');
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
    expect(screen.getByText('Missions Per Year')).toBeInTheDocument();
  });

  test('shows error placeholder when any year request fails', async () => {
    server.use(
      http.get('http://localhost:5136/api/getMissionsByYear', () =>
        HttpResponse.error(),
      ),
    );
    render(<MissionsPerYearChart />);
    await screen.findByText('Failed to load data.');
  });
});
