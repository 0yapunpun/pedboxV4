const controller = {};
const service = require('../engine/apiService.js');

controller.getMasgerCrm = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let response = await service.getMastersCrm(id_company);

  res.send(response);
}

controller.getDataCrm = async(req, res, next) => {
  let idUser = req.session.user.id;
  let typeUser = req.session.user.type_user;
  let id_company = req.session.user.id_company;
  let dateS = req.params.dateS;
  let dateE = req.params.dateE;

  let response = await service.getDataCrm(idUser, typeUser, id_company, dateS, dateE);

  res.send(response);
}



module.exports = controller