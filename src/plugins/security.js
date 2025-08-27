import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

export default fp(async (app) => {
  await app.register(helmet, { contentSecurityPolicy: false, hidePoweredBy: true });
  const origins = app.config.CORS_ORIGINS;
  await app.register(cors, {
    origin: (origin, cb) => !origin || !origins.length || origins.includes(origin) ? cb(null, true) : cb(new Error('CORS not allowed'), false),
    credentials: true,
  });
  await app.register(jwt, { secret: app.config.JWT_SECRET, sign: { expiresIn: app.config.JWT_TTL } });

  app.decorate('authenticate', async (req) => { await req.jwtVerify(); });
  app.decorate('requireAdmin', async (req) => { if (req.user?.role !== 'admin') throw app.httpErrors.forbidden('Admin only'); });
}, { name: 'security', dependencies: ['config'] });
