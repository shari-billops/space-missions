import {
  getCompanies,
  getMissionCountByCompany,
  getMissions,
  getMissionsByYear,
  getMissionStatusCount,
  getMissionStatuses,
  getRocketStatuses,
  getSuccessRate,
  getTopCompanies,
} from '../api/missionsApi';
import {
  mockMissions,
  mockStatusCounts,
  mockTopCompanies,
} from '../mocks/handlers';

describe('missionsApi', () => {
  test('getMissions resolves to mission array', async () => {
    const result = await getMissions({});
    expect(result).toEqual(mockMissions);
  });

  test('getCompanies resolves to string array', async () => {
    const result = await getCompanies();
    expect(result).toEqual(['SpaceX', 'NASA']);
  });

  test('getMissionStatuses resolves to status array', async () => {
    const result = await getMissionStatuses();
    expect(result).toEqual(['Success', 'Failure', 'Partial Failure', 'Prelaunch Failure']);
  });

  test('getRocketStatuses resolves to rocket status array', async () => {
    const result = await getRocketStatuses();
    expect(result).toEqual(['Active', 'Retired']);
  });

  test('getMissionStatusCount resolves to counts object', async () => {
    const result = await getMissionStatusCount();
    expect(result).toEqual(mockStatusCounts);
  });

  test('getTopCompanies resolves to company array', async () => {
    const result = await getTopCompanies(10);
    expect(result).toEqual(mockTopCompanies);
  });

  test('getMissionsByYear resolves to count for known year', async () => {
    const result = await getMissionsByYear(2000);
    expect(result).toBe(50);
  });

  test('getSuccessRate resolves to a rate', async () => {
    const result = await getSuccessRate('SpaceX');
    expect(result).toBe(85.5);
  });

  test('getMissionCountByCompany resolves to a count', async () => {
    const result = await getMissionCountByCompany('SpaceX');
    expect(result).toBe(42);
  });
});
