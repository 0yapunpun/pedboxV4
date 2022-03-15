const controller = {};
const userController = require('../controller/usersController.js');
const service = require('../engine/apiService.js');
const config = require('../engine/config.js');
const { nvFormatCash, hasPermission } = require('./helpers.js');
const _ = require('underscore');
const multer  = require('multer');
const moment = require('moment');
const { response } = require('express');

controller.helpdesk = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login');}
  if (!(hasPermission(req.session.user.permission ,"4000_CAN_ACCESS_HELPDESK"))) {return res.redirect('/no-permission');}

  let id_company = req.session.user.id_company;
  let id_user = req.session.user.id;

  let masters = {
    tipos: { datos: [], titulo: 'Tipos', tipo: 4 },
    categorias: { datos: [], titulo: 'Mesa de ayuda', tipo: 1 },
    clases: { datos: [], titulo: 'Clases', tipo: 5 },
    prioridades: { datos: [], titulo: 'Prioridades', tipo: 6},
    comportamientos: { datos: [], titulo: 'Comportamientos', tipo: 2 },
    estados: { datos: [], titulo: 'Estado', tipo: 3 },
    miembros: { datos: [], titulo: 'Miembros' },
    grupos: { datos: [], titulo: 'Grupos' },
    trabajos: { datos: [], titulo: 'Trabajos', tipo: 11 },
    subGrupos: { datos: [], titulo: 'SubGrupos' }
  };

  let formats = [];

  let helpdeskContent = await service.getHelpdeskIndicators(id_company, id_user);
  let users = await service.getUsersHelpdesk(id_company);
  let mastersData = await service.getMastersHelpdesk(id_company);
  let masterFormats = await service.getAdminFormat(id_company);

  if (mastersData.result.success){
    masters['tipos']['datos'] = mastersData.result['helpdesk']['type'];
    masters['categorias']['datos']  = mastersData.result['helpdesk']['area'];
    masters['clases']['datos']  = mastersData.result['helpdesk']['class'];
    masters['prioridades']['datos']  = mastersData.result['helpdesk']['priority'];
    masters['comportamientos']['datos']  = mastersData.result['helpdesk']['behavior'];
    masters['estados']['datos']  = mastersData.result['helpdesk']['status'];
    masters['grupos']['datos']  = mastersData.result['helpdesk']['group'];
    masters['subGrupos']['datos']  = mastersData.result['helpdesk']['sub_group'];
    masters['trabajos']['datos']  = mastersData.result['helpdesk']['work'];
  }

  if (masterFormats.result.success) {
    for (let value of masterFormats.result.activities) {
      formats.push({
          "id": value.id,
          "description": value.description,
          "status": value.status,
          "group": value.id_group_activity,
          "id_activity": value.id,
          "id_company": value.id_company,
          "modifiable": value.changed,
          "type_activity": value.id_type_activity,
          "is_request": value.is_request,
          "id_type_activity": value.id_type_activity,
          "id_group_activity": value.id_group_activity,
          "id_user": value.id_user,
          "changed": value.changed
      });
    }
  }

  res.render('helpdesk', {'session': req.session, 'content': helpdeskContent, 'masters':masters, 'formats': formats, "users": users})
} 

controller.helpdeskOcurrence = async (req, res, next) => {
  let id_company = req.session.user.id_company;
  let state = req.params.state;
  let ocurrence = req.params.ocurrence;

  let response = await service.getHelpdeskOcurrence(id_company, state, ocurrence);


  res.send({'res': response})
}

module.exports = controller