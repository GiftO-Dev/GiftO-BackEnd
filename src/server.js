require('dotenv').config();

const Koa = require('koa');
const body = require('koa-body');
const cors = require('koa-cors');
const Http = require('http');
const apiRouter = require('./api');

const app = new Koa();
const server = Http.createServer(app.callback());

app.use('/api', apiRouter.routes());

server.listen(process.env.PORT, () => {
  console.log(`Listening on port, ${process.env.PORT}`);  
});
