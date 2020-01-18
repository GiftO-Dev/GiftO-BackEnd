require('dotenv').config();

const Koa = require('koa');
const body = require('koa-body');
const cors = require('koa-cors');
const Router = require('koa-router');
const Http = require('http');
const facebookRepo = require('./repo/facebook');
const apiRouter = require('./api');

const app = new Koa();
const server = Http.createServer(app.callback());

const appRouter = new Router();
appRouter.use('/api', apiRouter.routes());

app.use(cors());
app.use(body({multipart: true}));
app.use(appRouter.routes());


server.listen(process.env.PORT, () => {
  console.log(`Listening on port, ${process.env.PORT}`);  
  facebookRepo.getAccessToken();
});
