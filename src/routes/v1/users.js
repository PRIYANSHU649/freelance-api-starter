import bcrypt from 'bcryptjs';
import { UserCreateBody, UserUpdateBody, UserResponse } from './_schemas.js';

export default async function (app) {
  const { User } = app.models;

  app.addHook('onRequest', app.authenticate);

  app.get('/users', {
    schema: {
      tags: ['users'],
      querystring: { type:'object', properties: { offset:{type:'string'}, limit:{type:'string'}, role:{type:'string'}, email:{type:'string'} } },
      response: { 200: { type:'object', properties: { items: { type:'array', items: UserResponse } } } },
    },
    preHandler: [app.requireAdmin],
  }, async (req) => {
    const q = req.query || {};
    const offset = Math.max(parseInt(q.offset || '0', 10), 0);
    const limit = Math.min(Math.max(parseInt(q.limit || '20', 10), 1), 100);
    const where = { tenantId: req.user.tenantId };
    if (q.role) where.role = q.role;
    if (q.email) where.email = { [app.db.Op.like]: `%${q.email}%` };
    const items = await User.findAll({ where, offset, limit, order: [['createdAt', 'DESC']] });
    return { items };
  });

  app.post('/users', {
    schema: { tags:['users'], body: UserCreateBody, response: { 201: UserResponse } },
    preHandler: [app.requireAdmin],
  }, async (req, reply) => {
    const { email, name, role='user', password } = req.body;
    try {
      const u = await User.create({
        email, name: name || null, role, tenantId: req.user.tenantId, passwordHash: bcrypt.hashSync(password || 'ChangeMe123!', 10)
      });
      reply.code(201).send(u);
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return reply.code(409).send({ error: { code: 'ERR_CONFLICT', message: 'Email already exists in tenant' } });
      }
      throw e;
    }
  });

  app.patch('/users/:id', {
    schema: { tags:['users'], body: UserUpdateBody, response: { 200: UserResponse } },
    preHandler: [app.requireAdmin],
  }, async (req, reply) => {
    const { id } = req.params;
    const { email, name, role, password } = req.body;
    const u = await User.findOne({ where: { id, tenantId: req.user.tenantId } });
    if (!u) return reply.code(404).send({ error: { code:'ERR_NOT_FOUND', message:'Not found' } });
    if (email !== undefined) u.email = email;
    if (name !== undefined) u.name = name || null;
    if (role !== undefined) u.role = role;
    if (password) u.passwordHash = bcrypt.hashSync(password, 10);
    await u.save();
    return u;
  });

  app.delete('/users/:id', {
    schema: { tags:['users'], response: { 204: { type: 'null' } } },
    preHandler: [app.requireAdmin],
  }, async (req, reply) => {
    await User.destroy({ where: { id: req.params.id, tenantId: req.user.tenantId } });
    reply.code(204);
  });
}
