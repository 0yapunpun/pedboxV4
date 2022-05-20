const controller = {};
const userController = require('../controller/usersController.js');
const service = require('../engine/apiService.js');
const config = require('../engine/config.js');
const { nvFormatCash, hasPermission } = require('./helpers.js');
const _ = require('underscore');
const moment = require('moment');
const { response } = require('express');


controller.agendaData = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let Status = 1; // Usuarios activos
  let usersCrm = 3; // Usuarios CRM
  let currentDate = req.params.date;

  let persons = await service.getUsersCompany(id_company, Status);
  let personsCRM = await service.getPersonsCompany(id_company, usersCrm);
  let mastersCrm = await service.getMastersCrm(id_company);
  let cumpleaños = await service.agendaCumpleaños(id_company);
  
  res.send({'persons': persons, 'personsCrm': personsCRM, 'mastersCrm': mastersCrm, "cumpleaños": cumpleaños});
}

controller.agendaGetData = async(req, res, next) => {
  let id_user = req.session.user.id;
  let date_begin = req.params.date_begin;
  let date_end = req.params.date_end;
  let id_company = req.session.user.id_company;
  let Status = 1; // Usuarios activos
  
  let data = await service.agendaGetDateUser(id_user, date_begin, date_end);
  let reportes = await service.getSellersReportsCrm(id_company, date_begin, date_end);
  let informes = await service.getQuoteReportCrm(id_company, date_begin, date_end);
  let persons = await service.getUsersCompany(id_company, Status);
  
  let dataFormated = [];
  let users = persons.result.datas.users;
  
  if (data.result.success) {
    for (let i = 0; i < data.result.data_user.length; i++) {
      if(data.result.data_user[i].status == 0) {continue} // No enviar eventos ya cerrados
      

      let userImg
      if (data.result.data_user[i].is_crm) {
        userImg = _.findWhere(users, {id: data.result.data_user[i].id_seller});
      } else {
        userImg = _.findWhere(users, {id: data.result.data_user[i].id_user_register});
      }

      let dateS = data.result.data_user[i].date_begin;
      if (data.result.data_user[i].hour_begin && data.result.data_user[i].hour_begin != "00:00:00" ) {
        dateS = dateS + "T" + data.result.data_user[i].hour_begin
      }

      let dateE = data.result.data_user[i].date_end;
      if (data.result.data_user[i].hour_end && data.result.data_user[i].hour_end != "23:59:00" ) {
        dateE = dateE + "T" + data.result.data_user[i].hour_end
      }

      data.result.data_user[i].imgUrl = userImg.photo || ""; // Adding the img user to the complete data
      data.result.data_user[i].userName = userImg.description || ""; // Adding the user name to the complete data

      let eventState = _.findWhere(data.result.data_user[i].activitie_user, {id_user: req.session.user.id});
      if(eventState.status != 2) {continue} // No enviar eventos que no hayan sido aceptados,

      dataFormated.push({
        id: data.result.data_user[i].id,
        title: data.result.data_user[i].subject, 
        detail: data.result.data_user[i].detail, 
        place: data.result.data_user[i].place, 
        start: dateS, 
        end: dateE, 
        dataS: data.result.data_user[i].hour_begin,
        dataE: data.result.data_user[i].hour_end, 
        imgUrl: userImg.photo || "",
        userName: userImg.description || "",
        editable: true,
        is_crm: data.result.data_user[i].is_crm,
        id_type: data.result.data_user[i].id_type,
        id_user: userImg.id
      })
    }
  }
  
  res.send([dataFormated, data, reportes.result, informes.result]);
}

controller.agendaCreateEvent = async(req, res, next) => {
  let body = req.body;
  let response = await service.agendaCreateEvent(body);

  res.send(response);
}

controller.agendaUpdateEvent = async(req, res, next) => {
  let body = req.body;
  let response = await service.agendaUpdateEvent(body);

  res.send(response);
}

controller.agendaDeleteEvent = async(req, res, next) => {
  let id = req.params.id;
  let body = {
    id_activitie: id,
    stauts: 0
  }

  let response = await service.agendaDeleteEvent(body);

  res.send(response);
}

controller.agendaCreateEventRepeat = async(req, res, next) => {
  let body = req.body;
  let response = await service.agendaCreateEventRepeat(body);

  res.send(response);
}

controller.agendaChangeEventState = async(req, res, next) => {
  let body = req.body;
  let response = await service.agendaChangeEventState(body);

  res.send(response);
}


module.exports = controller