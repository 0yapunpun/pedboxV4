const controller = {};
const service = require('../engine/apiService.js');


controller.dashboardData = async(req, res, next) => {
  let dateStart = req.params.dStart;
  let dateEnd = req.params.dEnd;
  let id_company = req.session.user.id_company
  let user = req.params.user;

  let data = await service.dashboardReport(id_company, dateStart, dateEnd, user);
  let sellers = await service.dashboardReportSeller(id_company, dateStart, dateEnd, 1, user);
  let sellersVisits = await service.dashboardReportSeller(id_company, dateStart, dateEnd, 2, user);
  let products = await service.dashboardReportProducts(id_company, dateStart, dateEnd, user);
  let persons = await service.getPersonsCompany(id_company, 5);
  
  res.send([data, sellers, products, persons, sellersVisits]);
}

controller.dashboardReportSeller = async(req, res, next) => {
  let dateStart = req.params.dStart;
  let dateEnd = req.params.dEnd;
  let id_company = req.session.user.id_company
  let seller = req.params.seller;

  let data = await service.dashboardReportSeller(id_company, dateStart, dateEnd, 1, seller);
  
  res.send(data);
}

controller.dashboardClientsSeller = async(req, res, next) => {
  let dateStart = req.params.dStart;
  let dateEnd = req.params.dEnd;
  let id_company = req.session.user.id_company
  let seller = req.params.seller;

  let data = await service.dashboardReportSeller(id_company, dateStart, dateEnd, 2, seller);
  
  res.send(data);
}








// controller.dashboardReport = async(req, res, next) => {
//   let dateStart = req.params.dStart;
//   let dateEnd = req.params.dEnd;
//   let id_company = req.session.user.id_company
//   let user = req.params.user;

//   let data = await service.dashboardReport(id_company, dateStart, dateEnd, user);
  
//   res.send(data);
// }

// controller.dashboardReportSeller = async(req, res, next) => {
//   let dateStart = req.params.dStart;
//   let dateEnd = req.params.dEnd;
//   let id_company = req.session.user.id_company
//   let seller = req.params.seller;

//   let data = await service.dashboardReportSeller(id_company, dateStart, dateEnd, seller);
  
//   res.send(data);
// }

controller.dashboardReportProducts = async(req, res, next) => {
  let dateStart = req.params.dStart;
  let dateEnd = req.params.dEnd;
  let id_company = req.session.user.id_company
  let user = req.params.user;

  let data = await service.dashboardReportProducts(id_company, dateStart, dateEnd, user);
  
  res.send(data);
}





module.exports = controller