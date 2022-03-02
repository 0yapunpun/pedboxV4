const controller = {};
const _ = require('underscore');
const userController = require('../controller/usersController.js');
const service = require('../engine/apiService.js');
const { nvFormatCash } = require('./helpers');
const moment = require('moment');
const { response } = require('express');

controller.login = async(req, res, next) => {
  res.render('login');
}

controller.loginValidate = async(req, res, next) => {
  const resp = await userController.login(req.body);
  if (resp.result=='ok') {
    // console.log(resp)
    req.session.login = true;
    req.session.urlSocket = resp.urlSocket;
    req.session.user = resp.user;
    delete resp.user;
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

controller.helpdesk = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }

  res.render('helpdesk', {'session': req.session})
}

controller.crm = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  
  res.render('crm', {'session': req.session});
}

module.exports = controller