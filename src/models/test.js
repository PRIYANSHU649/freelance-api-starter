// src/models/test.js
import { DataTypes, Model } from 'sequelize';

export class Test extends Model {}

/** 初始化 Test 模型（表名：tests） */
export function initTest(sequelize) {
  Test.init(
    {
      id: { type: DataTypes.STRING(36), primaryKey: true },
      tenantId: { type: DataTypes.STRING(36), allowNull: false, field: 'tenant_id' },
      // 业务字段
      name: { type: DataTypes.STRING(128), allowNull: false },
      status: { type: DataTypes.ENUM('draft', 'active'), allowNull: false, defaultValue: 'draft' },
      score: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'tests', // 实际表名
      timestamps: true,   // createdAt/updatedAt
      indexes: [
        { fields: ['tenant_id'] },
        { unique: true, fields: ['tenant_id', 'name'] }, // 同租户 name 唯一
      ],
    }
  );

  return Test;
}
