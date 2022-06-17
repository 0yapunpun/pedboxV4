const controller = {};
const service = require('../engine/apiService.js');

controller.thirdsClients = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let status = 1;

  let masters = await service.thirdsMasters(id_company)
  let response = await service.thirdsClients(id_company, 3);
  let response2 = await service.thirdsClients(id_company, 5);
  let response3 = await service.thirdsClients(id_company, 2);
  let response4 = await service.thirdsClients(id_company, 4);
  

  res.send({masters: masters, clients: response.result.persons, employes: response2.result.persons, prospects: response3.result.persons, suppliers: response4.result.persons})
}


module.exports = controller