const fetch = require('node-fetch');
const { showLog } = require('./helpers');
const service = {};
const urlKakashi = 'https://api.pedbox.co:8590/';

const options = (method, body) => { 
  var opt = {method: method, headers: {'Content-Type': 'application/json'}}; 
  if (method == 'post') opt['body'] = JSON.stringify(body);
  return opt;
}

service.login = async(body) => {
  const url = urlKakashi+'validater_user';
  return await makeRequest(url, options('post', body));
}

const makeRequest = async (url, options) => {
  try {
      var resp = await fetch(url, options || {});
      if (!resp.ok) return {'err': 'Error obteniendo los datos'};
      
      const json = await resp.json();
      return {'result': json};
  } catch(error) {
      showLog('REQUEST URL: '+url, error);
      return {'err': 'Error obteniendo los datos', 'err_service': error};
  }
}

module.exports = service