// src/models/index.js
import { initTenant, Tenant } from './tenant.js'
import { initUser, User } from './user.js'
import { initTest, Test } from './test.js'

export function initModels(sequelize) {
    // 初始化各模型
    initTenant(sequelize)
    initUser(sequelize)
    initTest(sequelize)

    // 关联：User 属于 Tenant
    User.belongsTo(Tenant, { foreignKey: 'tenant_id' })
    Tenant.hasMany(User, { foreignKey: 'tenant_id' })

    // 关联：Test 属于 Tenant
    Test.belongsTo(Tenant, { foreignKey: 'tenant_id' })
    Tenant.hasMany(Test, { foreignKey: 'tenant_id' })

    return { Tenant, User, Test }
}
