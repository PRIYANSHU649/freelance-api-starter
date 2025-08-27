import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { RegisterBody, LoginBody } from './_schemas.js';

export default async function (app) {
  const { Tenant, User } = app.models;

  app.post('/auth/register', { schema: { tags:['auth'], body: RegisterBody } }, async (req, reply) => {
    const { tenantName, email, name, password } = req.body;
    const tenantId = randomUUID(); const userId = randomUUID();
    const hash = bcrypt.hashSync(password, 10);
    await Tenant.create({ id: tenantId, name: tenantName });
    await User.create({ id: userId, tenantId, email, name: name || null, role: 'admin', passwordHash: hash });
    const token = await app.jwt.sign({ sub: userId, tenantId, role: 'admin', email });
    reply.code(201).send({ tenantId, userId, accessToken: token });
  });

  app.post('/auth/login', { schema: { tags:['auth'], body: LoginBody } }, async (req, reply) => {
    const { tenantId, email, password } = req.body;
    const user = await User.findOne({ where: { tenantId, email } });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return reply.code(401).send({ error: { code: 'ERR_AUTH', message: 'Invalid credentials' } });
    }
    const token = await app.jwt.sign({ sub: user.id, tenantId, role: user.role, email });
    return { accessToken: token };
  });

  app.get('/auth/whoami', { schema: { tags:['auth'] }, preHandler: [app.authenticate] }, async (req) => ({ user: req.user }));
}
