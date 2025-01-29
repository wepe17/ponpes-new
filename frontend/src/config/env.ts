import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_DB_HOST: z.string(),
  VITE_DB_USER: z.string(),
  VITE_DB_PASSWORD: z.string(),
  VITE_DB_NAME: z.string(),
  VITE_DB_PORT: z.string().transform(Number),
});

const env = {
  API_URL: import.meta.env.VITE_API_URL,
  DB_HOST: import.meta.env.VITE_DB_HOST,
  DB_USER: import.meta.env.VITE_DB_USER,
  DB_PASSWORD: import.meta.env.VITE_DB_PASSWORD,
  DB_NAME: import.meta.env.VITE_DB_NAME,
  DB_PORT: import.meta.env.VITE_DB_PORT,
} as const;

export const validateEnv = () => {
  try {
    return envSchema.parse(env);
  } catch (error) {
    console.error('Invalid environment variables:', error);
    throw new Error('Invalid environment variables');
  }
};

export const config = validateEnv();