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
  
    let body = {"doc": req.session.user.nit};
    let puntos = await service.calidosos(body);
  
    res.render('helpdesk', {'session': req.session, 'puntos': puntos});
  }