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

controller.helpdeskDetail = async(req, res, next) => {
  let id = req.params.id;
  let id_node = req.params.id_node;
  let id_workflow_header = req.params.id_workflow_header;
  let id_workflow = req.params.id_workflow;
  let id_activitie = req.params.id_activitie;

  let activitie = await service.getManagement(id_activitie); 
  let response = await service.getDetailformat(id, id_node, id_workflow_header, id_workflow);

  res.send({'response': response, 'activitie': activitie})
}

controller.helpdeskOcurrence = async (req, res, next) => {
  let id_company = req.session.user.id_company;
  let state = req.params.state;
  let ocurrence = req.params.ocurrence;
  
  let response = await service.getHelpdeskOcurrence(id_company, state, ocurrence);

  res.send({'res': response})
}

controller.helpdeskSolicitudes = async (req, res, next) => {
  let id_company = req.session.user.id_company;
  let id_user = req.session.user.id;
  let formats = [];
  
  let response = await service.getSolicitudes(id_company, id_user);

  console.log(response)
  if (response.result.success) {
    response = response.result.data;
    
    for (let valInput of response) {
      let filterFormat = formats.filter((a) => {
        return (""+a.id == ""+valInput.id_format)? true: false;
      })[0];
      if(filterFormat) {
        valInput['dateB'] = nvFormatDate(valInput.date.replace("Z",""), "dddd DD de mmmm, YYYY");
        valInput['hourB'] = nvFormatDate(valInput.date.replace("Z",""), "hhhh:mm ampm");
        valInput['format'] = filterFormat;
        valInput['id_workflow'] = (valInput['id_workflow'])? valInput['id_workflow']: null;
        valInput['comment'] = (valInput['comment'])? valInput['comment']: null;
        valInput['workflow'] = (valInput['workflow'])? valInput['workflow']: null;
        valInput['info_status'] = null;

        if(!valInput.workflow) {
          valInput.info_status = statusRequest[0];
        }else if(valInput.comment) {
          valInput.info_status = statusRequest[3];
        }else {
            valInput.workflow['percentage'] = 0;
            if(valInput.workflow.actual && valInput.workflow.total) {
              valInput.workflow.percentage = (valInput.workflow.actual / valInput.workflow.total) * 100;
              valInput.workflow.percentage = valInput.workflow.percentage.toFixed(0);
            }

            if(valInput.workflow.percentage < 100) {
              valInput.info_status = statusRequest[1];
            }else {
              valInput.info_status = statusRequest[2];
            }
        }
        result.push(valInput);

        let uidUser = 'u'+valInput.id_user;
        if(valInput.id_group) {
            let uidGroup = 'g'+valInput.id_group;
            let uidSubgroup = 'sg'+valInput.id_subgroup;

            if(!groupRequest[uidGroup]) {
                groupRequest[uidGroup] = {
                  'id': valInput.id_group,
                  'count': 0,
                  'description': nvCapitalize(valInput.group_desc),
                  'subgroups': {},
                  'uid': uidGroup
                }
                toggleRequestBy.group[uidGroup] = false;
            }
            if(!groupRequest[uidGroup]['subgroups'][uidSubgroup]) {
                groupRequest[uidGroup]['subgroups'][uidSubgroup] = {
                  'id': valInput.id_subgroup,
                  'count': 0,
                  'description': nvCapitalize(valInput.subgroup),
                  'users': [],
                  'uid': uidSubgroup
                }
                toggleRequestBy.subgroup[uidGroup+uidSubgroup] = false;
            }
            if(!groupRequest[uidGroup]['subgroups'][uidSubgroup]['users'][uidUser]) {
                groupRequest[uidGroup]['subgroups'][uidSubgroup]['users'][uidUser] = {
                  'count': 0,
                  'description': nvCapitalize(valInput.user),
                  'id_user': valInput.id_user,
                  'id_group': valInput.id_group,
                  'id_subgroup': valInput.id_subgroup
                }
            }
            if(''+valInput.info_status.id == '1') {
              groupRequest[uidGroup]['count']++;
              groupRequest[uidGroup]['subgroups'][uidSubgroup]['count']++;
              groupRequest[uidGroup]['subgroups'][uidSubgroup]['users'][uidUser]['count']++;
            }
        }else {
          let uidGroup = 'g-1';
          let uidSubgroup = 'sg-1';

          if(!groupRequest[uidGroup]) {
              groupRequest[uidGroup] = {
                  'id': -1, 'count': 0,
                  'description': 'Sin asignar',
                  'subgroups': {}, 'uid': uidGroup
              }
              toggleRequestBy.group[uidGroup] = false;
          }
          if(!groupRequest[uidGroup]['subgroups'][uidSubgroup]) {
              groupRequest[uidGroup]['subgroups'][uidSubgroup] = {
                  'id': -1, 'count': 0,
                  'description': 'Sin asignar',
                  'users': [], 'uid': uidSubgroup
              }
              toggleRequestBy.subgroup[uidGroup+uidSubgroup] = false;
          }
          if(!groupRequest[uidGroup]['subgroups'][uidSubgroup]['users'][uidUser]) {
              groupRequest[uidGroup]['subgroups'][uidSubgroup]['users'][uidUser] = {
                  'count': 0,
                  'description': nvCapitalize(valInput.user),
                  'id_user': valInput.id_user,
                  'id_group': valInput.id_group,
                  'id_subgroup': valInput.id_subgroup
              }
          }
          if(''+valInput.info_status.id == '1') {
              groupRequest[uidGroup]['count']++;
              groupRequest[uidGroup]['subgroups'][uidSubgroup]['count']++;
              groupRequest[uidGroup]['subgroups'][uidSubgroup]['users'][uidUser]['count']++;
          }
        }
      } else {
        console.log("?")
      }
    }

  }


  res.send({'res': response})
}

module.exports = controller