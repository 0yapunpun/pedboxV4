const controller = {};
const notificationController = require('../controller/notificationController.js');
const service = require('../engine/apiService.js');
const { showLog } = require('../engine/helpers.js');

controller.login = async(body) => {
  const {err, result} = await service.login(body);

  let errUser = {'err': 'Usuario y/o contraseña no válida'};
  if (err || !result.success) return errUser;

  return {'result': 'ok', 'urlSocket': result.url_socket, 'user': result.user[0]};  
}

controller.loginCompany = async(id_company) => {
  const {err, result} = await service.loginCompany(id_company);

  let errResponse = {'err': 'Datos compañia no encontrados'};
  if (err || !result.success) return errResponse;

  return {'success': true, 'data': result.data[0]};  
}

controller.loginValidate = async(req, res, next) => {
  const resp = await controller.login(req.body);
  if (resp.result=='ok') {
    notificationController.subscribeSocket(resp.user);

    req.session.login = true;
    req.session.urlSocket = resp.urlSocket;
    req.session.user = resp.user;
    delete resp.urlSocket;
  }
  return res.send(resp);
}

controller.logout = (req, res) => {
  req.session.destroy((err) => {
    if(err) return console.error(err);
    res.redirect('/login'); return;
  });
}
module.exports = controller