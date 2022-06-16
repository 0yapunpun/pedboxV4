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


controller.exportDataCrm = async(req, res, next) => {
  let idUser = req.session.user.id;
  let typeUser = req.session.user.type_user;
  let id_company = req.session.user.id_company;
  let dateS = req.params.dateS;
  let dateE = req.params.dateE;

  let response = await service.exportDataCrm(idUser, typeUser, id_company, dateS, dateE);

  res.send(response);
}




controller.createCrmMaster = async(req, res, next) => {
  let response = await service.createCrmMaster(req.body);
  res.send(response);
}

controller.updateCrmMaster = async(req, res, next) => {
  let response = await service.updateCrmMaster(req.body);
  res.send(response);
}

controller.deleteCrmMaster = async(req, res, next) => {
  let response = await service.deleteCrmMaster(req.body);
  res.send(response);
}

controller.getCrmDetailMonitoring = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let dateS = req.params.dateS;
  let dateE = req.params.dateE;
  let persons = req.params.persons;

  let response = await service.getCrmDetailMonitoring(id_company, dateS, dateE, persons);
  res.send(response);
}

controller.getCrmActivityMonitoring = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let dateS = req.params.dateS;
  let dateE = req.params.dateE;
  let persons = req.params.persons;
  let id_activity = req.params.id_activity;

  let response = await service.getCrmActivityMonitoring(id_activity, id_company, dateS, dateE, persons);
  res.send(response);
}

controller.getCrmDetailCartera = async(req, res, next) => {
  let url_client = req.body.url_client;
  let seller = req.body.seller;

  let response = await service.getCrmDetailCartera(url_client, seller);
  res.send(response);
}

controller.getCrmDetailCarteraExport = async(req, res, next) => {
  let url_client = req.body.url_client;
  let seller = req.body.seller;
  let logoUrl = req.body.seller;

  let response = await service.getCrmDetailCarteraExport(url_client, seller, logoUrl);
  res.send(response);
}





module.exports = controller