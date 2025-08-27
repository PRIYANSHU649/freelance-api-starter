import { buildApp } from '../app.js';
const app = await buildApp();
const res = await app.inject({ method: 'GET', url: '/docs/json' });
if (res.statusCode !== 200) { console.error('Swagger disabled'); process.exit(1); }
console.log(res.body);
await app.close();
