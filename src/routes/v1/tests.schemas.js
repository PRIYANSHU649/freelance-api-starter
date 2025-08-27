// src/routes/v1/tests.schemas.js
export const TestCreateBody = {
    type: 'object',
    required: ['name'],
    properties: {
        name: { type: 'string', minLength: 1 },
        status: { type: 'string', enum: ['draft', 'active'] },
        score: { type: 'integer', minimum: 0 },
    },
}

export const TestUpdateBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1 },
        status: { type: 'string', enum: ['draft', 'active'] },
        score: { type: 'integer', minimum: 0 },
    },
}

export const TestResponse = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        tenantId: { type: 'string' },
        name: { type: 'string' },
        status: { type: 'string' },
        score: { type: 'integer' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
    },
}
