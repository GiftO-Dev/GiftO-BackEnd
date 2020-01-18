const request = require('request-promise-native');
const facebookConfig = require('../../../config/facebook');
const { clientId, clientSecret } = facebookConfig;

exports.getAccessToken = async () => {
  const option = {
    method: 'GET',
    uri: 'https://graph.facebook.com/oauth/access_token',
    qs: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: client_credentials
    },
    json: true,

  };

  const resp = await request(option);
  console.log(resp);
};

exports.sendMessage = async () => {
  
};
