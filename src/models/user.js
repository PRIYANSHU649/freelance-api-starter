import { DataTypes, Model } from 'sequelize';

export class User extends Model {}
export function initUser(sequelize) {
  User.init({
    id: { type: DataTypes.STRING(36), primaryKey: true },
    tenantId: { type: DataTypes.STRING(36), allowNull: false, field: 'tenant_id' },
    email: { type: DataTypes.STRING(191), allowNull: false },
    name: { type: DataTypes.STRING(128), allowNull: true },
    role: { type: DataTypes.ENUM('admin','user'), allowNull: false, defaultValue: 'admin' },
    passwordHash: { type: DataTypes.STRING(191), allowNull: false, field: 'password_hash' },
  }, {
    sequelize,
    modelName: 'users',
    timestamps: true,
    indexes: [
      { fields: ['tenant_id', 'role'] },
      { unique: true, fields: ['tenant_id', 'email'] },
    ],
  });
  return User;
}
