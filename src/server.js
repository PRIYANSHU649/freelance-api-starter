import { buildApp } from './app.js';

async function main() {
  const app = await buildApp();
  const { HOST, PORT } = app.config;

  const shutdown = async () => { try { await app.close(); process.exit(0); } catch (e) { app.log.error(e); process.exit(1); } };
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);

  try { await app.listen({ host: HOST, port: PORT }); app.log.info(`Listening on http://${HOST}:${PORT} (Docs: /docs)`); }
  catch (err) { app.log.error(err); process.exit(1); }
}
main();
