const Router = require('koa-router');
const giftCtrl = require('./gift.ctrl');

const giftRouter = new Router();

giftRouter.get('/', giftCtrl.getGift);
giftRouter.post('/', giftCtrl.sendGift);
giftRouter.delete('/', giftCtrl.removeGift);

module.exports = giftRouter;
