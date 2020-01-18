const Router = require('koa-router');
const userCtrl = require('./user.ctrl');

const userRouter = new Router();

userRouter.get('/me/friends', userCtrl.getFriendsList);

module.exports = userRouter;
