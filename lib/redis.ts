// import { Redis } from '@upstash/redis';

// export const redis = new Redis({
//   url: process.env.KV_REST_API_URL,
//   token: process.env.KV_REST_API_TOKEN
// });
import Redis from 'ioredis';


export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
});