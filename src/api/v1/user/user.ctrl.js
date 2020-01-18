const facebookRepo = require('../../../repo/facebook');

exports.getFriendsList = async (ctx) => {
  const {header} = ctx.request
  
  if (!header.authorization){
    ctx.status = 400;
    ctx.body = {
      msg: "너님 토큰 없음"
    }
    return;
  }

  ctx.status = 200;
  const fbResult = await facebookRepo.getFriends(header.authorization);
  if (!fbResult) {
    ctx.status = 403;
    ctx.body = {
      msg: "친구 조회 실패"
    }
    return;
  }
  const fbData = fbResult.data;

  if (Array.isArray(fbData)) { 
    const primiseArray = [];

    for (var i in fbData) {
      const profileImageUrl = await facebookRepo.getProfileImage(fbData[i].id);
      fbData[i].profileImage = profileImageUrl.data.url;
    }
  }

  ctx.body = {
    status: 200,
    message: '성공',
    data: {
      friends: fbData,
    },
  };
  
};