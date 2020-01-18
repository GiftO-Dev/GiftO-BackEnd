module.exports = async (ctx, next) => {
  const { facebook_access_token } = ctx.request.headers;
  if (!!facebook_access_token === false) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      message: 'Facebook Access Token을 전송하십시오.',
    }

    return;
  }

  await next();
};
