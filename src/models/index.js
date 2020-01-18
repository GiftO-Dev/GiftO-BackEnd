const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('./../../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    logging: false,
    port: config.port,
    timezone: '+09:00',
  },
);

const models = {};

// 현재 디렉터리의 모델 파일들 불러오기
fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    const extName = path.extname(path.join(__dirname, file));
    const baseName = path.basename(path.join(__dirname, file), extName);

    const model = sequelize.import(path.join(__dirname, file));
    models[baseName] = model;
  });

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

// 스키마 동기화
sequelize.sync().then(() => {
  console.log('[Model - Index] Schema is synchronized');
}).catch((err) => {
  console.log('[Model - Index] An error has occurred: ', err);
});

models.sequelize = sequelize;
models.Sequelize = sequelize;

module.exports = models;
