import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  test('renders all main sections', async () => {
    render(<App />);

    // Header
    expect(screen.getByText('Space Missions Dashboard')).toBeInTheDocument();

    // Filter panel inputs
    expect(screen.getByLabelText('Company')).toBeInTheDocument();

    // Stats load asynchronously
    await screen.findByText('Total Missions');

    // All three charts load their responsive containers
    await waitFor(() =>
      expect(screen.getAllByTestId('mock-ResponsiveContainer')).toHaveLength(3),
    );

    // Table header
    await screen.findByText('Mission Data');
  });

  test('Reset button resets filters to defaults', async () => {
    const user = userEvent.setup();
    render(<App />);

    const companyInput = screen.getByLabelText('Company');

    // Type into company filter
    await user.type(companyInput, 'SpaceX');
    expect(companyInput).toHaveValue('SpaceX');

    // Click Reset
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(companyInput).toHaveValue('');
  });
});
