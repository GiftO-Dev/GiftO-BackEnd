const Router = require('koa-router');
const giftRouter = require('./gift');
const userRotuer = require('./user');

const v1Router = new Router();

v1Router.use('/gift', giftRouter.routes());
v1Router.use('/user', userRotuer.routes());

module.exports = v1Router;
