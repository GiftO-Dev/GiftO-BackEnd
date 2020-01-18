const request = require('request-promise-native');
const facebookConfig = require('../../../config/facebook');
const { clientId, clientSecret, pageAccessToken } = facebookConfig;

/**
 * @author 전광용 <jeon@kakao.com>
 * @description Access Token 발급
 */
exports.getAccessToken = async () => {
  const option = {
    method: 'GET',
    uri: 'https://graph.facebook.com/oauth/access_token',
    qs: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    },
    json: true,

  };

  try {
    const resp = await request(option);
    return resp;
  } catch (error) {
    console.log(`[FACEBOOK] 토큰 조회 실패: ${error}`);
    return null;
  }
};

/**
 * @author 전광용 <jeon@kakao.com>
 * @description 메시지 전송
 * @param {String} recipient
 * @param {String} message
 */
exports.sendMessage = async (recipient, message) => {
  const option = {
    method: 'POST',
    uri: 'https://graph.facebook.com/v5.0/me/messages',
    qs: {
      access_token: pageAccessToken,
    },
    body: {
      messaging_type: '',
      recipient: {
        id: recipient,
      },
      message: {
        text: message,
      }
    },
    json: true,
  };

  try {
    const resp = await request(option);
    return resp;
  } catch (error) {
    console.log(`[FACEBOOK] 메시지 발송 실패: ${error}`);
    return null;
  }
};

/**
 * @author 전광용 <jeon@kakao.com>
 * @description 친구 목록 조회
 * @param {String} accessToken
 */
exports.getFriends = async (accessToken) => {
  const option = {
    method: 'GET',
    uri: 'https://graph.facebook.com/v5.0/me/friends',
    qs: {
      access_token: accessToken,
    },
    json: true,
  };

  try {
    const resp = await request(option);
    return resp;
  } catch (error) {
    console.log(`[FACEBOOK] 친구 조회 실패: ${error}`);
    return null;
  }
}

exports.getProfileImage = async (profileId) => {
  const option = {
    method: 'GET',
    uri: `https://graph.facebook.com/v5.0/${profileId}/picture`,
    qs: {
      redirect: false,
      height: 100,
      width: 100,
    },

    json: true,
  };

  try {
    const resp = await request(option);
    return resp;
  } catch (error) {
    console.log(`[FACEBOOK] 프로필 사진 조회 실패: ${error}`);
    return null;
  }
};
