import { Sequelize } from 'sequelize';

export let sequelize;

export function initSequelize(dsn) {
  if (sequelize) return sequelize;
  sequelize = new Sequelize(dsn, {
    dialect: 'mysql',
    pool: { max: Number(process.env.DB_POOL || 10), min: 0, idle: 10000 },
    logging: process.env.NODE_ENV !== 'production' ? console.log : false,
    define: { underscored: true, freezeTableName: true },
  });
  return sequelize;
}
