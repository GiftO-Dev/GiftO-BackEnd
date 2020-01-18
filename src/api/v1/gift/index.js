const Router = require('koa-router');
const giftCtrl = require('./gift.ctrl');
const authMiddleware = require('../../../middleware/auth');

const giftRouter = new Router();

giftRouter.get('/', giftCtrl.getGift);
giftRouter.post('/', authMiddleware, giftCtrl.sendGift);
giftRouter.delete('/', giftCtrl.removeGift);

module.exports = giftRouter;
