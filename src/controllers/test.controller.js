// src/controllers/test.controller.js
import { randomUUID } from 'node:crypto'

/**
 * GET /v1/tests
 * query: offset? limit? name? status?
 */
export async function listTests(app, req) {
    const { Test } = app.models
    const q = req.query || {}
    const offset = Math.max(parseInt(q.offset || '0', 10), 0)
    const limit = Math.min(Math.max(parseInt(q.limit || '20', 10), 1), 100)

    const where = { tenantId: req.user.tenantId }
    if (q.status) where.status = q.status
    if (q.name) where.name = { [app.db.Op.like]: `%${q.name}%` }

    const items = await Test.findAll({ where, offset, limit, order: [['createdAt', 'DESC']] })
    return { items }
}

/**
 * POST /v1/tests
 * body: { name, status?, score? }
 */
export async function createTest(app, req, reply) {
    const { Test } = app.models
    const { name, status = 'draft', score = 0 } = req.body

    try {
        const t = await Test.create({
            id: randomUUID(),
            tenantId: req.user.tenantId,
            name,
            status,
            score,
        })
        reply.code(201)
        return t
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return reply
                .code(409)
                .send({ error: { code: 'ERR_CONFLICT', message: 'name 已存在（同租户）' } })
        }
        throw e
    }
}

/** GET /v1/tests/:id */
export async function getTest(app, req, reply) {
    const { Test } = app.models
    const row = await Test.findOne({ where: { id: req.params.id, tenantId: req.user.tenantId } })
    if (!row)
        return reply.code(404).send({ error: { code: 'ERR_NOT_FOUND', message: 'Not found' } })
    return row
}

/**
 * PATCH /v1/tests/:id
 * body: { name?, status?, score? }
 */
export async function updateTest(app, req, reply) {
    const { Test } = app.models
    const row = await Test.findOne({ where: { id: req.params.id, tenantId: req.user.tenantId } })
    if (!row)
        return reply.code(404).send({ error: { code: 'ERR_NOT_FOUND', message: 'Not found' } })

    const { name, status, score } = req.body
    if (name !== undefined) row.name = name
    if (status !== undefined) row.status = status
    if (score !== undefined) row.score = score
    await row.save()
    return row
}

/** DELETE /v1/tests/:id */
export async function deleteTest(app, req, reply) {
    const { Test } = app.models
    await Test.destroy({ where: { id: req.params.id, tenantId: req.user.tenantId } })
    reply.code(204)
}
