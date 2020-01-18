const Router = require('koa-router');
const v1Router = require('./v1');
const apiRouter = new Router();

apiRouter.use('/v1', v1Router.routes());

module.exports = apiRouter;
