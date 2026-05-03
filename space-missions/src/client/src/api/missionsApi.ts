import axios from "axios";
import type { Filters, Mission, MissionStatusCounts, TopCompany } from "../types/mission";

const api = axios.create({ baseURL: "http://localhost:5136" });

export const getMissions = (filters: Partial<Filters>): Promise<Mission[]> =>
  api.get<Mission[]>("/api/missions", { params: filters }).then((r) => r.data);

export const getCompanies = (): Promise<string[]> =>
  api.get<string[]>("/api/companies").then((r) => r.data);

export const getMissionStatuses = (): Promise<string[]> =>
  api.get<string[]>("/api/statuses/mission").then((r) => r.data);

export const getRocketStatuses = (): Promise<string[]> =>
  api.get<string[]>("/api/statuses/rocket").then((r) => r.data);

export const getMissionStatusCount = (): Promise<MissionStatusCounts> =>
  api.get<MissionStatusCounts>("/api/getMissionStatusCount").then((r) => r.data);

export const getTopCompanies = (n: number): Promise<TopCompany[]> =>
  api.get<TopCompany[]>("/api/getTopCompaniesByMissionCount", { params: { n } }).then((r) => r.data);

export const getMissionsByYear = (year: number): Promise<number> =>
  api.get<number>("/api/getMissionsByYear", { params: { year } }).then((r) => r.data);

export const getSuccessRate = (company: string): Promise<number> =>
  api.get<number>("/api/getSuccessRate", { params: { company } }).then((r) => r.data);

export const getMissionCountByCompany = (company: string): Promise<number> =>
  api.get<number>("/api/getMissionCountByCompany", { params: { company } }).then((r) => r.data);
