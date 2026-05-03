import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import SummaryStats from '../components/Stats/SummaryStats';
import type { Filters } from '../types/mission';
import { server } from '../mocks/server';
import { mockStatusCountsAllZero } from '../mocks/handlers';

const defaultFilters: Filters = {
  company: '',
  missionStatus: '',
  rocketStatus: '',
  startDate: '',
  endDate: '',
};

describe('SummaryStats', () => {
  test('renders nothing while loading (null return)', () => {
    const { container } = render(<SummaryStats filters={defaultFilters} />);
    // Synchronous initial render: counts is null, returns null
    expect(container.firstChild).toBeNull();
  });

  test('renders all stat cards after data loads', async () => {
    render(<SummaryStats filters={defaultFilters} />);
    await screen.findByText('Total Missions');
    expect(screen.getByText('4,850')).toBeInTheDocument();
    expect(screen.getByText('4,000')).toBeInTheDocument();
    expect(screen.getByText('600')).toBeInTheDocument();
  });

  test('displays correct success rate (non-zero total)', async () => {
    render(<SummaryStats filters={defaultFilters} />);
    await screen.findByText('Total Missions');
    // 4000/4850 * 100 = 82.47%
    expect(screen.getByText('82.47%')).toBeInTheDocument();
  });

  test('displays 0.00% when total is zero', async () => {
    server.use(
      http.get('http://localhost:5136/api/getMissionStatusCount', () =>
        HttpResponse.json(mockStatusCountsAllZero),
      ),
    );
    render(<SummaryStats filters={defaultFilters} />);
    await screen.findByText('Overall Success Rate');
    expect(screen.getByText('0.00%')).toBeInTheDocument();
  });

  test('shows Filters Active card when a filter is set', async () => {
    render(<SummaryStats filters={{ ...defaultFilters, company: 'SpaceX' }} />);
    await screen.findByText('Filters Active');
  });

  test('does not show Filters Active with no active filters', async () => {
    render(<SummaryStats filters={defaultFilters} />);
    await screen.findByText('Total Missions');
    expect(screen.queryByText('Filters Active')).not.toBeInTheDocument();
  });

  test('shows error message on API failure', async () => {
    server.use(
      http.get('http://localhost:5136/api/getMissionStatusCount', () =>
        HttpResponse.error(),
      ),
    );
    render(<SummaryStats filters={defaultFilters} />);
    await screen.findByText('Failed to load statistics.');
  });
});
