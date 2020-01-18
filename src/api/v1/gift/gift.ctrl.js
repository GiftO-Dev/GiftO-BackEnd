const models = require('../../../models');
const giftValidate = require('../../../lib/validate/gift');
const uuid = require('uuid/v4');

/**
 * @author 전광용 <jeon@kakao.com>
 * @description [GET] IDX로 선물 조회
 */
exports.getGift = async (ctx) => {
  try {
    const { accessId } = ctx.request.query;
    console.log(`[GIFT] 선물 조회 요청 : ${idx}`);
    
    if (!idx) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: '검증 오류',
      };

      return;
    }

    const result = await models.Gift.getByAccessId(accessId);

    console.log('> 조회 성공');
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: '조회 성공',
      data: {
        gift: result,
      },
    };
  } catch (error) {
    console.log(`> 서버 오류: ${error}`);

    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '서버 오류',
    };
  }
};

/**
 * @author 전광용 <jeon@kakao.com>
 * @description [POST] 선물 등록 API
 */
exports.sendGift = async (ctx) => {
  const { body } = ctx.request;
  console.log('[GIFT] 선물 등록 요청');

  try {
    try {
      await giftValidate.validateGift(body);
    } catch (error) {
      console.log(`> 검증 오류: ${error}`);
  
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: '검증 오류',
      };
  
      return;
    }
  
    const accessId = uuid();
    const createdData = await models.Gift.create({
      ...body,
      accessId,
    });
    
  
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: '성공적으로 수행하였습니다.',
      data: {
        gift: createdData,
      },
    };
  } catch (error) {
    console.log(`> 서버 오류: ${error}`);

    ctx.status = 500;
    ctx.body = {
      status: 500,
      message: '서버 오류',
    };
  }
};