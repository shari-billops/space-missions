import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPanel from '../components/Filters/FilterPanel';
import type { Filters } from '../types/mission';

const defaultFilters: Filters = {
  company: '',
  missionStatus: '',
  rocketStatus: '',
  startDate: '',
  endDate: '',
};

function setup(filters: Filters = defaultFilters) {
  const onChange = jest.fn();
  const onReset = jest.fn();
  render(<FilterPanel filters={filters} onChange={onChange} onReset={onReset} />);
  return { onChange, onReset };
}

describe('FilterPanel', () => {
  test('renders all inputs and reset button', () => {
    setup();
    expect(screen.getByLabelText('Company')).toBeInTheDocument();
    expect(screen.getByLabelText('Mission Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Rocket Status')).toBeInTheDocument();
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  test('company input has maxLength 100', () => {
    setup();
    expect(screen.getByLabelText('Company')).toHaveAttribute('maxlength', '100');
  });

  test('company change fires onChange (non-date key path)', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await user.type(screen.getByLabelText('Company'), 'S');
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, company: 'S' });
  });

  test('company blur trims whitespace and calls onChange', () => {
    const { onChange } = setup({ ...defaultFilters, company: '  SpaceX  ' });
    fireEvent.blur(screen.getByLabelText('Company'));
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, company: 'SpaceX' });
  });

  test('company blur does not call onChange when already trimmed', () => {
    const { onChange } = setup({ ...defaultFilters, company: 'SpaceX' });
    fireEvent.blur(screen.getByLabelText('Company'));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('mission status select calls onChange', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await user.selectOptions(screen.getByLabelText('Mission Status'), 'Success');
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, missionStatus: 'Success' });
  });

  test('rocket status select calls onChange', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await user.selectOptions(screen.getByLabelText('Rocket Status'), 'Active');
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, rocketStatus: 'Active' });
  });

  test('startDate change with empty endDate calls onChange, no error', () => {
    const { onChange } = setup();
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2020-01-01' } });
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, startDate: '2020-01-01' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('endDate change with empty startDate calls onChange, no error', () => {
    const { onChange } = setup();
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2020-01-01' } });
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, endDate: '2020-01-01' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('valid date range (start <= end) clears error and calls onChange', () => {
    const { onChange } = setup({ ...defaultFilters, endDate: '2021-06-01' });
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2020-01-01' } });
    expect(onChange).toHaveBeenCalledWith({
      ...defaultFilters,
      startDate: '2020-01-01',
      endDate: '2021-06-01',
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('startDate > endDate shows error and blocks onChange', () => {
    const { onChange } = setup({ ...defaultFilters, endDate: '2019-01-01' });
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2021-01-01' } });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Start date must be on or before end date.')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('endDate < startDate shows error and blocks onChange', () => {
    const { onChange } = setup({ ...defaultFilters, startDate: '2021-01-01' });
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2019-01-01' } });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('reset button clears a shown date error and calls onReset', () => {
    const { onReset } = setup({ ...defaultFilters, endDate: '2019-01-01' });
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2021-01-01' } });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onReset).toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('From max attribute reflects endDate when set', () => {
    setup({ ...defaultFilters, endDate: '2023-06-15' });
    expect(screen.getByLabelText('From')).toHaveAttribute('max', '2023-06-15');
  });

  test('From max attribute defaults to today when endDate is empty', () => {
    setup();
    const today = new Date().toISOString().split('T')[0];
    expect(screen.getByLabelText('From')).toHaveAttribute('max', today);
  });

  test('To min attribute reflects startDate when set', () => {
    setup({ ...defaultFilters, startDate: '2020-03-01' });
    expect(screen.getByLabelText('To')).toHaveAttribute('min', '2020-03-01');
  });

  test('To min attribute defaults to 1957-01-01 when startDate is empty', () => {
    setup();
    expect(screen.getByLabelText('To')).toHaveAttribute('min', '1957-01-01');
  });
});
