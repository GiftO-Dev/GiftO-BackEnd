const uuid = require('uuid/v4');
const moment = require('moment');
const schedule = require('node-schedule');
const models = require('../../../models');
const giftValidate = require('../../../lib/validate/gift');
const facebookRepo = require('../../../repo/facebook');
const emailRepo = require('../../../repo/email');

const scheduleObject = {};

/**
 * @author 전광용 <jeon@kakao.com>
 * @description [GET] IDX로 선물 조회
 */
exports.getGift = async (ctx) => {
  try {
    const { accessId } = ctx.request.query;
    console.log(`[GIFT] 선물 조회 요청 : ${accessId}`);
    
    if (!accessId) {
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

    facebookRepo.sendMessage(body.to, `축하합니다! 누군가가 당신에게 복덩이를 선물하였습니다!\nhttp://gift-o.jaehoon.kim/check?accessId=${accessId}`);
    // emailRepo.sendEmail(body.to, '[GIFTo] 복덩이 도착!', `축하합니다! 누군가가 당신에게 복덩이를 선물하였습니다!\nhttp://localhost:8080/check?accessId=${accessId}`);
    
    const scheduleATime = moment().add(10, 'seconds').toDate();
    const scheduleBTime = moment().add(20, 'seconds').toDate();
    const scheduleCTime = moment().add(30, 'seconds').toDate();
    
    const scheduleA = schedule.scheduleJob(scheduleATime, async () => {
      const hints = await models.GiftHint.findByGiftIdx(createdData.idx);
      facebookRepo.sendMessage(body.to, `선물한 사람을 더 쉽게 찾을 수 있는 힌트를 드립니다.\n${hints[0].hint}`);
    });

    const scheduleB = schedule.scheduleJob(scheduleBTime, async () => {
      const hints = await models.GiftHint.findByGiftIdx(createdData.idx);
      facebookRepo.sendMessage(body.to, `선물한 사람을 더 쉽게 찾을 수 있는 힌트를 드립니다.\n${hints[1].hint}`);
    });

    const scheduleC = schedule.scheduleJob(scheduleCTime, async () => {
      const hints = await models.GiftHint.findByGiftIdx(createdData.idx);
      facebookRepo.sendMessage(body.to, `선물한 사람을 더 쉽게 찾을 수 있는 힌트를 드립니다.\n${hints[2].hint}`);
    });

    scheduleObject[createdData.idx] = [scheduleA, scheduleB, scheduleC];
  
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

  if(Array.isArray(scheduleObject[result.idx])) {
    scheduleObject[result.idx].forEach((job) => {
      job.cancel();
    });
  }
};