import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import MissionsTable from '../components/Table/MissionsTable';
import type { Filters } from '../types/mission';
import { server } from '../mocks/server';

const defaultFilters: Filters = {
  company: '',
  missionStatus: '',
  rocketStatus: '',
  startDate: '',
  endDate: '',
};

describe('MissionsTable', () => {
  test('shows loading indicator on initial render', async () => {
    render(<MissionsTable filters={defaultFilters} />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    await screen.findByText('SpaceX'); // wait for load to complete
  });

  test('renders mission rows after data loads', async () => {
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('SpaceX');
    expect(screen.getByText('Crew Demo-2')).toBeInTheDocument();
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });

  test('shows error state on API failure', async () => {
    server.use(
      http.get('http://localhost:5136/api/missions', () => HttpResponse.error()),
    );
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('Failed to load missions.');
  });

  test('shows empty state when no missions returned', async () => {
    server.use(
      http.get('http://localhost:5136/api/missions', () => HttpResponse.json([])),
    );
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('No missions match the current filters.');
  });

  test('pagination is hidden when there are no results', async () => {
    server.use(
      http.get('http://localhost:5136/api/missions', () => HttpResponse.json([])),
    );
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('No missions match the current filters.');
    expect(screen.queryByText(/Page/)).not.toBeInTheDocument();
  });

  test('pagination is hidden on error', async () => {
    server.use(
      http.get('http://localhost:5136/api/missions', () => HttpResponse.error()),
    );
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('Failed to load missions.');
    expect(screen.queryByText(/Page/)).not.toBeInTheDocument();
  });

  test('pagination shows correct page count with 26 missions', async () => {
    render(<MissionsTable filters={defaultFilters} />);
    // 26 missions at pageSize 25 → 2 pages
    await screen.findByText('Page 1 of 2');
  });

  test('price cell shows — for null price', async () => {
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('SpaceX');
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  test('price cell shows value for non-null price', async () => {
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('SpaceX');
    expect(screen.getByText('55.00')).toBeInTheDocument();
  });

  test('known missionStatus uses STATUS_COLORS color', async () => {
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('SpaceX');
    const successCells = screen.getAllByText('Success');
    expect(successCells[0]).toHaveStyle('color: var(--success)');
  });

  test('unknown missionStatus falls back to inherit color', async () => {
    render(<MissionsTable filters={defaultFilters} />);
    const unknownCell = await screen.findByText('UnknownStatus');
    expect(unknownCell).toHaveStyle('color: inherit');
  });

  test('sortable column headers have sortable class', async () => {
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('SpaceX');
    const dateHeader = screen.getByRole('columnheader', { name: /^Date$/ });
    expect(dateHeader).toHaveClass('sortable');
  });

  test('clicking column header cycles through asc, desc, and no sort', async () => {
    const user = userEvent.setup();
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('SpaceX');

    // Initial: no sort indicator on Date header
    const dateHeader = screen.getByRole('columnheader', { name: /^Date$/ });
    expect(dateHeader.textContent).toBe('Date');

    // First click → asc
    await user.click(dateHeader);
    await waitFor(() =>
      expect(screen.getByRole('columnheader', { name: /↑/ })).toBeInTheDocument(),
    );

    // Second click → desc
    await user.click(screen.getByRole('columnheader', { name: /↑/ }));
    await waitFor(() =>
      expect(screen.getByRole('columnheader', { name: /↓/ })).toBeInTheDocument(),
    );

    // Third click → no sort
    await user.click(screen.getByRole('columnheader', { name: /↓/ }));
    await waitFor(() =>
      expect(screen.getByRole('columnheader', { name: /^Date$/ })).toBeInTheDocument(),
    );
  });

  test('pagination: Prev is disabled on first page and Next navigates forward', async () => {
    const user = userEvent.setup();
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('Page 1 of 2');

    expect(screen.getByRole('button', { name: '← Prev' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next →' })).not.toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Next →' }));
    await screen.findByText('Page 2 of 2');
    expect(screen.getByRole('button', { name: 'Next →' })).toBeDisabled();
  });

  test('page size change updates pagination', async () => {
    const user = userEvent.setup();
    render(<MissionsTable filters={defaultFilters} />);
    await screen.findByText('Page 1 of 2');

    // Change to 100 per page → all 26 missions on 1 page
    await user.selectOptions(screen.getByDisplayValue('25'), '100');
    await screen.findByText('Page 1 of 1');
  });
});
