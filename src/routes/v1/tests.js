// src/routes/v1/tests.js
import { TestCreateBody, TestUpdateBody, TestResponse } from './tests.schemas.js'
import {
    listTests,
    createTest,
    getTest,
    updateTest,
    deleteTest,
} from '../../controllers/test.controller.js'

export default async function (app) {
    // 所有 /tests 路由需要登录
    app.addHook('onRequest', app.authenticate)

    // 列表（仅登录即可）
    app.get(
        '/tests',
        {
            schema: {
                tags: ['tests'],
                querystring: {
                    type: 'object',
                    properties: {
                        offset: { type: 'string' },
                        limit: { type: 'string' },
                        name: { type: 'string' },
                        status: { type: 'string', enum: ['draft', 'active'] },
                    },
                },
                response: {
                    200: {
                        type: 'object',
                        properties: { items: { type: 'array', items: TestResponse } },
                    },
                },
            },
        },
        async (req) => listTests(app, req)
    )

    // 新增（管理员）
    app.post(
        '/tests',
        {
            schema: { tags: ['tests'], body: TestCreateBody, response: { 201: TestResponse } },
            preHandler: [app.requireAdmin],
        },
        async (req, reply) => createTest(app, req, reply)
    )

    // 详情（仅登录）
    app.get(
        '/tests/:id',
        {
            schema: { tags: ['tests'], response: { 200: TestResponse } },
        },
        async (req, reply) => getTest(app, req, reply)
    )

    // 更新（管理员）
    app.patch(
        '/tests/:id',
        {
            schema: { tags: ['tests'], body: TestUpdateBody, response: { 200: TestResponse } },
            preHandler: [app.requireAdmin],
        },
        async (req, reply) => updateTest(app, req, reply)
    )

    // 删除（管理员）
    app.delete(
        '/tests/:id',
        {
            schema: { tags: ['tests'], response: { 204: { type: 'null' } } },
            preHandler: [app.requireAdmin],
        },
        async (req, reply) => deleteTest(app, req, reply)
    )
}
