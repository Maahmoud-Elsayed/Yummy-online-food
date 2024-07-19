import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const emailRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  ephemeralCache: new Map(),
  prefix: "@upstash/ratelimit",
});

export const ipRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  ephemeralCache: new Map(),
  prefix: "@upstash/ratelimit",
});
