import { DataTypes, Model } from 'sequelize';

export class Tenant extends Model {}
export function initTenant(sequelize) {
  Tenant.init({
    id: { type: DataTypes.STRING(36), primaryKey: true },
    name: { type: DataTypes.STRING(128), allowNull: false },
  }, { sequelize, modelName: 'tenants', timestamps: true });
  return Tenant;
}
