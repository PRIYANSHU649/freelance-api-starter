import fp from 'fastify-plugin';
import * as dotenv from 'dotenv';

export default fp(async (app) => {
  dotenv.config();
  const get = (k, def) => process.env[k] ?? def;
  const must = (k) => { const v = process.env[k]; if (!v) throw new Error(`Missing env ${k}`); return v; };

  app.decorate('config', {
    HOST: get('HOST','0.0.0.0'),
    PORT: Number(get('PORT','3000')),
    LOG_LEVEL: get('LOG_LEVEL','info'),
    BODY_LIMIT: Number(get('BODY_LIMIT','1048576')),
    DATABASE_URL: must('DATABASE_URL'),
    CORS_ORIGINS: (get('CORS_ORIGINS','')||'').split(',').map(s=>s.trim()).filter(Boolean),
    COMPRESSION_THRESHOLD: Number(get('COMPRESSION_THRESHOLD','1024')),
    JWT_SECRET: must('JWT_SECRET'),
    JWT_TTL: get('JWT_TTL','30m'),
    RATE_LIMIT_MAX: Number(get('RATE_LIMIT_MAX','400')),
    RATE_LIMIT_WINDOW: get('RATE_LIMIT_WINDOW','1 minute'),
    SWAGGER_ENABLED: get('SWAGGER_ENABLED','true') === 'true',
    DB_SYNC: get('DB_SYNC','alter'),
  });
}, { name: 'config' });
