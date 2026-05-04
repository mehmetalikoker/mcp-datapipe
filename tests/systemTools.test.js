import { handleSystemInfo } from '../src/tools/systemTools';
describe('System Tools', () => {
    test('should return system info for platform', async () => {
        const result = await handleSystemInfo({ topic: 'platform' });
        expect(result).toBe('Sistem bilgisi sorgulandı: platform');
    });
    test('should return system info for cpu', async () => {
        const result = await handleSystemInfo({ topic: 'cpu' });
        expect(result).toBe('Sistem bilgisi sorgulandı: cpu');
    });
    test('should return system info for memory', async () => {
        const result = await handleSystemInfo({ topic: 'memory' });
        expect(result).toBe('Sistem bilgisi sorgulandı: memory');
    });
    test('should default to platform when no topic provided', async () => {
        const result = await handleSystemInfo({});
        expect(result).toBe('Sistem bilgisi sorgulandı: platform');
    });
});
//# sourceMappingURL=systemTools.test.js.map