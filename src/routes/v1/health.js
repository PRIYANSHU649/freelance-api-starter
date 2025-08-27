export default async function (app) {
  app.get('/health', { schema: { tags: ['system'] } }, async () => ({ status: 'ok' }));
  app.get('/ready', { schema: { tags: ['system'] } }, async (_req, reply) => {
    try { await app.db.authenticate(); return { status: 'ready' }; }
    catch { reply.code(503); return { status: 'unready' }; }
  });
}
