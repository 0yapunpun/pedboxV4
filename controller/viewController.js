const controller = {};
const _ = require('underscore');
const userController = require('../controller/usersController.js');
const notificationController = require('../controller/notificationController.js');
const service = require('../engine/apiService.js');
const { nvFormatCash } = require('./helpers');
const moment = require('moment');
const { response } = require('express');

controller.login = async(req, res, next) => {
  let token = (req.params.token ? req.params.token : "");
  if (token) {
    let dataToken = token.split("cc").pop().split("ee");
    if(dataToken[0] != "0") {
      const resp = await userController.loginCompany(dataToken[0]);
      return res.render('login', {"dataCompany": resp});
    }
  } 
  res.render('login', {"dataCompany": {}});
}

controller.loginValidate = async(req, res, next) => {
  const resp = await userController.login(req.body);
  if (resp.result=='ok') {
    const notificationSocket = await notificationController.subscribeSocket(resp.user);

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

controller.index = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  
  res.render('index', {'session': req.session});
}

controller.noPermission = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }

  res.render('elements/no-permission', {'session': req.session});
}

controller.chat = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }

  let response = await service.removeNotificationByKind(req.session.user.id, 5); // Delete all notification of messages 
  
  res.render('chat', {'session': req.session, "id_chat": false});
}

controller.chatOpenConversation = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  
  res.render('chat', {'session': req.session, "id_chat": req.params.id});
}

controller.agenda = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  
  res.render('agenda', {'session': req.session});
}

//** Vistas no integradas
controller.crm = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  
  res.render('crm', {'session': req.session});
}

module.exports = controller