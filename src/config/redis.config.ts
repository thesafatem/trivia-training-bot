import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheStore } from '@nestjs/common/cache';
import { redisStore } from 'cache-manager-redis-store';

export const getRedisConfig = async (
  config: ConfigService,
): Promise<CacheModuleOptions> => {
  const store = await redisStore({
    socket: {
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT'),
    },
  });
  return {
    store: store as unknown as CacheStore,
  };
};
