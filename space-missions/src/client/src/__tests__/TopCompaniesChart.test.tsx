import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import TopCompaniesChart from '../components/Charts/TopCompaniesChart';
import { server } from '../mocks/server';

describe('TopCompaniesChart', () => {
  test('shows loading placeholder on initial render', () => {
    render(<TopCompaniesChart />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  test('renders chart after data loads', async () => {
    render(<TopCompaniesChart />);
    await screen.findByTestId('mock-ResponsiveContainer');
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
    expect(screen.getByText('Top 10 Companies by Missions')).toBeInTheDocument();
  });

  test('shows error placeholder on API failure', async () => {
    server.use(
      http.get('http://localhost:5136/api/getTopCompaniesByMissionCount', () =>
        HttpResponse.error(),
      ),
    );
    render(<TopCompaniesChart />);
    await screen.findByText('Failed to load data.');
  });
});
