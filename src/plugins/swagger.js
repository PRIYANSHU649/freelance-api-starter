import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

export default fp(async (app) => {
  if (!app.config.SWAGGER_ENABLED) return;
  await app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: { title: 'JS Sequelize Starter API', version: '1.0.0' },
      components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
      security: [{ bearerAuth: [] }],
    },
  });
  await app.register(swaggerUI, { routePrefix: '/docs' });
}, { name: 'swagger', dependencies: ['config'] });
