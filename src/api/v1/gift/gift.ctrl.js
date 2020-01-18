const models = require('../../../models');
const giftValidate = require('../../../lib/validate/gift');
const facebookRepo = require('../../../repo/facebook');
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
    const hintResult = await models.GiftHint.findByGiftIdx(result.idx);
    result.hint = hintResult;

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
    const hint = body.hint;
    delete body.hint;

    const createdData = await models.Gift.create({
      ...body,
      accessId,
    });

    if (Array.isArray(hint)) {
      hint.forEach((hintElement) => {
        models.GiftHint.create({
          giftIdx: createdData.idx,
          hint: hintElement,
        });
      });
    } else if (!!hint) {
      models.GiftHint.create({
        giftIdx: createdData.idx,
        hint: hint,
      });
    }

    await facebookRepo.sendMessage(body.to, `축하합니다! 누군가가 당신에게 복덩이를 선물하였습니다! http://localhost:8080/check?accessId=${accessId}`);
  
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

/**
 * @author 전광용 <jeon@kakao.com>
 * @description [DELETE] 선물 삭제
 */
exports.removeGift = async (ctx) => {
  const { accessId } = ctx.request.query;

  if (!accessId) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      message: '검증 오류',
    };
    
    return;
  }

  const result = await models.Gift.getByAccessId(accessId);

  await models.GiftHint.destory({
    where: {
      giftIdx: result.idx,
    },
  });

  await models.Gift.destory({
    where: {
      idx: result.idx,
    },
  });
};