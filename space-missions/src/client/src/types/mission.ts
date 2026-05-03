export interface Mission {
  company: string;
  location: string;
  date: string;
  time: string | null;
  rocket: string;
  name: string;
  rocketStatus: string;
  price: string | null;
  missionStatus: string;
}

export interface TopCompany {
  company: string;
  count: number;
}

export interface MissionStatusCounts {
  Success: number;
  Failure: number;
  "Partial Failure": number;
  "Prelaunch Failure": number;
}

export interface Filters {
  company: string;
  missionStatus: string;
  rocketStatus: string;
  startDate: string;
  endDate: string;
}
