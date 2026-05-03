import { http, HttpResponse } from 'msw';
import type { Mission, MissionStatusCounts, TopCompany } from '../types/mission';

export const mockMissions: Mission[] = [
  {
    company: 'SpaceX',
    location: 'Cape Canaveral, FL',
    date: '2020-05-30',
    time: '19:22',
    rocket: 'Falcon 9',
    name: 'Crew Demo-2',
    rocketStatus: 'Active',
    price: '55.00',
    missionStatus: 'Success',
  },
  {
    company: 'RVSN USSR',
    location: 'Baikonur Cosmodrome',
    date: '1959-01-02',
    time: null,
    rocket: 'Sputnik 8K71PS',
    name: 'Luna 1',
    rocketStatus: 'Retired',
    price: null,
    missionStatus: 'UnknownStatus',
  },
  // 24 extra missions to push past pageSize=25 and exercise pagination
  ...Array.from({ length: 24 }, (_, i): Mission => ({
    company: `Company${i}`,
    location: 'Earth',
    date: '2000-01-01',
    time: null,
    rocket: 'RocketX',
    name: `Mission${i}`,
    rocketStatus: 'Active',
    price: String(i * 10),
    missionStatus: 'Success',
  })),
];

export const mockStatusCounts: MissionStatusCounts = {
  Success: 4000,
  Failure: 600,
  'Partial Failure': 200,
  'Prelaunch Failure': 50,
};

// Failure count is 0 — exercises the filter(v > 0) false branch
export const mockStatusCountsWithZero: MissionStatusCounts = {
  Success: 4000,
  Failure: 0,
  'Partial Failure': 200,
  'Prelaunch Failure': 50,
};

// Unknown key — exercises the COLORS[name] ?? '#58a6ff' fallback branch
export const mockStatusCountsUnknownKey = {
  Success: 100,
  MyUnknownStatus: 42,
} as unknown as MissionStatusCounts;

// All zeros — exercises the total > 0 ? ... : '0.00' false branch in SummaryStats
export const mockStatusCountsAllZero: MissionStatusCounts = {
  Success: 0,
  Failure: 0,
  'Partial Failure': 0,
  'Prelaunch Failure': 0,
};

export const mockTopCompanies: TopCompany[] = [
  { company: 'SpaceX', count: 200 },
  { company: 'RVSN USSR', count: 180 },
];

const mockYearData: Record<number, number> = { 2000: 50 };

export const handlers = [
  http.get('http://localhost:5136/api/missions', () =>
    HttpResponse.json(mockMissions),
  ),

  http.get('http://localhost:5136/api/companies', () =>
    HttpResponse.json(['SpaceX', 'NASA']),
  ),

  http.get('http://localhost:5136/api/statuses/mission', () =>
    HttpResponse.json(['Success', 'Failure', 'Partial Failure', 'Prelaunch Failure']),
  ),

  http.get('http://localhost:5136/api/statuses/rocket', () =>
    HttpResponse.json(['Active', 'Retired']),
  ),

  http.get('http://localhost:5136/api/getMissionStatusCount', () =>
    HttpResponse.json(mockStatusCounts),
  ),

  http.get('http://localhost:5136/api/getTopCompaniesByMissionCount', () =>
    HttpResponse.json(mockTopCompanies),
  ),

  http.get('http://localhost:5136/api/getMissionsByYear', ({ request }) => {
    const year = Number(new URL(request.url).searchParams.get('year'));
    return HttpResponse.json(mockYearData[year] ?? 0);
  }),

  http.get('http://localhost:5136/api/getSuccessRate', () =>
    HttpResponse.json(85.5),
  ),

  http.get('http://localhost:5136/api/getMissionCountByCompany', () =>
    HttpResponse.json(42),
  ),
];
