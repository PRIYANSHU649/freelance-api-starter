export const RegisterBody = {
    type: 'object',
    required: ['tenantName', 'email', 'password'],
    properties: {
        tenantName: { type: 'string' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        password: { type: 'string', minLength: 6 },
    },
}
export const LoginBody = {
    type: 'object',
    required: ['tenantId', 'email', 'password'],
    properties: {
        tenantId: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
    },
}
export const UserCreateBody = {
    type: 'object',
    required: ['email'],
    properties: {
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        role: { type: 'string', enum: ['admin', 'user'] },
        password: { type: 'string', minLength: 6 },
    },
}
export const UserUpdateBody = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        role: { type: 'string', enum: ['admin', 'user'] },
        password: { type: 'string', minLength: 6 },
    },
}
export const UserResponse = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string', nullable: true },
        role: { type: 'string' },
        tenantId: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
    },
}
