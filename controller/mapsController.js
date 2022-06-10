const controller = {};
const service = require('../engine/apiService.js');

controller.sellersList = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let id_user = req.params.id_user;

  let response = await service.getSellersList(id_company, id_user);
  res.send(response);
}

controller.getDataModuleRecorridos = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let date = req.params.date;
  let sellers = req.params.sellers;

  let rSellers = await service.getPersonsMapByDate(id_company, date, sellers);
  let rSales = await service.getSellersManagment(id_company, date, date);

  res.send([rSellers, rSales]);
}

controller.getDataRecorridosByDate = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let date = req.params.date;
  let sellers = req.params.sellers;

  let rSellers = await service.getPersonsMapByDate(id_company, date, sellers);

  res.send(rSellers);
}

controller.getInformeByDate = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let dateS = req.params.dateS;
  let dateE = req.params.dateE;

  let rSales = await service.getSellersManagment(id_company, dateS, dateE);

  res.send(rSales);
}

controller.getDetailRecorrido = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let id_seller = req.params.id_seller; 
  let id_user = req.params.id_user; 
  let date = req.params.date;

  let r1 = await service.getSellerHistoryRecorrido(id_company, id_seller, date, date);
  let r2 = await service.getSellerClients(id_company, id_user);

  res.send([r1, r2]);
}


module.exports = controller