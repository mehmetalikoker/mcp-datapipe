import { z } from "zod";

// Şema tanımları
export const GetSystemInfoSchema = z.object({
  topic: z.enum(["cpu", "memory", "platform"]).optional()
});

// Araç mantığı (Business Logic)
export async function handleSystemInfo(args: z.infer<typeof GetSystemInfoSchema>) {
  const { topic = "platform" } = args;
  // Burada gerçek sistem işlemlerini yapabilirsiniz (örn: 'os' modülü ile)
  return `Sistem bilgisi sorgulandı: ${topic}`;
}