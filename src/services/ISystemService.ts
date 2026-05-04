import { SystemInfoRequest } from '../types/index.js';

export interface ISystemService {
  getSystemInfo(request: SystemInfoRequest): Promise<string>;
}