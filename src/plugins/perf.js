import fp from 'fastify-plugin';
import compress from '@fastify/compress';
import rateLimit from '@fastify/rate-limit';

export default fp(async (app) => {
  await app.register(compress, { global: true, threshold: app.config.COMPRESSION_THRESHOLD });
  await app.register(rateLimit, { max: app.config.RATE_LIMIT_MAX, timeWindow: app.config.RATE_LIMIT_WINDOW });
}, { name: 'perf', dependencies: ['config'] });
