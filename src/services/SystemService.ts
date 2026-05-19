import * as os from 'os';
import { SystemInfoRequest } from '../types/index.js';
import { ISystemService } from './ISystemService.js';

export class SystemService implements ISystemService {
  async getSystemInfo(request: SystemInfoRequest): Promise<string> {
    const { topic = 'platform' } = request;

    switch (topic) {
      case 'cpu':
        return this.getCpuInfo();
      case 'memory':
        return this.getMemoryInfo();
      case 'platform':
        return this.getPlatformInfo();
      default: {
        const _exhaustive: never = topic;
        throw new Error(`Geçersiz topic: ${_exhaustive}`);
      }
    }
  }

  private getCpuInfo(): string {
    const cpus = os.cpus();
    const cpuInfo = {
      model: cpus[0].model,
      cores: cpus.length,
      speed: `${cpus[0].speed} MHz`
    };
    return `CPU Bilgisi: ${JSON.stringify(cpuInfo, null, 2)}`;
  }

  private getMemoryInfo(): string {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryInfo = {
      total: `${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
      used: `${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
      free: `${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB`
    };
    return `Bellek Bilgisi: ${JSON.stringify(memoryInfo, null, 2)}`;
  }

  private getPlatformInfo(): string {
    const platformInfo = {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      hostname: os.hostname()
    };
    return `Platform Bilgisi: ${JSON.stringify(platformInfo, null, 2)}`;
  }
}