const controller = {};
const service = require('../engine/apiService.js');
const { showLog } = require('../engine/helpers.js');

controller.login = async(body) => {
  const {err, result} = await service.login(body);
  let errUser = {'err': 'Usuario y/o contraseña no válida'};
  if (err || !result.success) return errUser;
  return {'result': 'ok', 'urlSocket': result.url_socket, 'user': result.user[0]};  
}

module.exports = controller