const baseJoi = require('@hapi/joi');
const dateJoi = require('@hapi/joi-date');

const joi = baseJoi.extend(dateJoi);

exports.validateGift = async (body) => {
  const schema = joi.object().keys({
    from: joi.string().required(),
    to: joi.string().required(),
    present: joi.string().required(),
    expiredAt: joi.date().required(),
    hint: joi.array().required(),
  });

  try {
    return await schema.validateAsync(body);
  } catch (e) {
    console.log(`> Validate Error: ${e}`);
    throw e;
  }
}