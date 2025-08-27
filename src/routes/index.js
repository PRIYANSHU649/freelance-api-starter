import health from './v1/health.js';
import auth from './v1/auth.js';
import users from './v1/users.js';
import tests from './v1/tests.js';

export default async function (app) {
  await app.register(health, { prefix: '/v1' });
  await app.register(auth, { prefix: '/v1' });
  await app.register(users, { prefix: '/v1' });
   await app.register(tests,  { prefix: '/v1' }); // ← 新增
}
