import { SystemService } from '../src/services/SystemService.js';

describe('System Tools', () => {
  let systemService: SystemService;

  beforeEach(() => {
    systemService = new SystemService();
  });

  test('should return system info for platform', async () => {
    const result = await systemService.getSystemInfo({ topic: 'platform' });
    expect(result).toContain('Platform Bilgisi');
  });

  test('should return system info for cpu', async () => {
    const result = await systemService.getSystemInfo({ topic: 'cpu' });
    expect(result).toContain('CPU Bilgisi');
  });

  test('should return system info for memory', async () => {
    const result = await systemService.getSystemInfo({ topic: 'memory' });
    expect(result).toContain('Bellek Bilgisi');
  });

  test('should default to platform when no topic provided', async () => {
    const result = await systemService.getSystemInfo({});
    expect(result).toContain('Platform Bilgisi');
  });
});