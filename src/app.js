import Fastify from 'fastify';
import configPlugin from './plugins/config.js';
import securityPlugin from './plugins/security.js';
import perfPlugin from './plugins/perf.js';
import swaggerPlugin from './plugins/swagger.js';
import routes from './routes/index.js';
import { initSequelize } from './lib/db.js';
import { initModels } from './models/index.js';
import { Sequelize, Op } from 'sequelize';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
    },
    trustProxy: true,
    bodyLimit: Number(process.env.BODY_LIMIT || 1048576),
    keepAliveTimeout: 75_000,
  });

  await app.register(configPlugin);
  await app.register(securityPlugin);
  await app.register(perfPlugin);
  await app.register(swaggerPlugin);

  // DB + Models
  const sequelize = initSequelize(app.config.DATABASE_URL);
  app.decorate('db', Object.assign(sequelize, { Op }));
  app.decorate('models', initModels(sequelize));

  // sync strategy (dev only)
  const s = app.config.DB_SYNC;
  if (s && s !== 'none') {
    await sequelize.sync({ alter: s === 'alter', force: s === 'force' });
  }

  await app.register(routes);

  app.setErrorHandler((err, _req, reply) => {
    app.log.error({ err }, 'unhandled');
    const status = err.statusCode || 500;
    const message = status >= 500 ? 'Internal Server Error' : err.message;
    reply.code(status).send({ error: { code: status >= 500 ? 'ERR_INTERNAL' : 'ERR_BAD_REQUEST', message } });
  });

  return app;
}
