import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_CLIENT_SECRET: z.string(),
  SPOTIFY_TOKEN_URL: z.string(),
  SPOTIFY_API_URL: z.string(),

  DEEPSEEK_API_TOKEN: z.string(),
  DEEPSEEK_BASE_URL: z.string().url(),
  DEEPSEEK_ENGINE_CHAT: z.string(),
  DEEPSEEK_ENGINE_REASONER: z.string(),

  GPT_API_TOKEN: z.string(),
  GPT_ENGINE: z.string(),

  PORT: z.coerce.number().default(3000),
  BEARER_TOKEN: z.string(),
  GPT_MAX_TOKENS: z.coerce.number(),
});
