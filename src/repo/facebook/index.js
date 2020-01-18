const FBMessenger = require('fb-messenger');
const request = require('request-promise-native');
const crypto = require('crypto');
const { MessengerClient } = require('messaging-api-messenger');
const facebookConfig = require('../../../config/facebook');
const { clientId, clientSecret, pageAccessToken } = facebookConfig;

const client = new FBMessenger({token: pageAccessToken});

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
exports.sendMessage = async (fbid, message) => {
  // const hmac = await getHmac();
  // console.log(hmac);

  // const psidOption = {
  //   method: 'POST',
  //   uri: 'https://graph.facebook.com/v2.11/pages_id_mapping',
  //   body: {
  //     access_token: pageAccessToken,
  //     appsecret_proof: hmac,
  //     user_ids: recipient
  //   },
  //   json: true
  // };

  // const respPsid = await request(psidOption);
  // console.log(respPsid);


  const option = {
    method: 'POST',
    uri: 'http://bb7f7a51.ngrok.io/api/v1/message',
    body: {
      name: fbid,
      message,
    },
    json: true,
  };

  try {
    const resp = await request(option);
    return resp;
  } catch (error) {
    console.log(`[FACEBOOK] 메시지 발송 실패: ${error}`);
    return nulcl;
  }

  const result = await client.sendTextMessage({id: recipient, text: message});
  console.log(result);
};

exports.createNotifcations = async (recipient, message) => {
  const appAccessToken = await this.getAccessToken();
  const appToken = appAccessToken.access_token;

  const option = {
    method: 'POST',
    uri: `https://graph.facebook.com/v5.0/${recipient}/notifications`,
    qs: {
      access_token: appToken,
      href: 'http://localhost:3000',
      template: message,
    },
  };

  const result = await request(option);
  console.log(result);
}

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

const getHmac = async () => {
  const hmac = crypto.createHmac('sha256', clientSecret);
  const hash = hmac.update(pageAccessToken).digest('hex');

  return hash;
}