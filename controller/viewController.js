const controller = {};
const _ = require('underscore');
const userController = require('../controller/usersController.js');
const service = require('../engine/apiService.js');

const { hasPermission } = require('./helpers.js');

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

controller.index = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }

  res.render('index', {'session': req.session});
}

controller.noPermission = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }

  res.render('elements/no-permission', {'session': req.session});
}

controller.agenda = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  
  res.render('agenda', {'session': req.session});
}

//** B2B - Extranet
controller.calidosos = async (req, res, next) => {
  if (!req.session.login) { return res.redirect('/login');}
  if (!(hasPermission(req.session.user.permission ,"8028_CAN_ACCESS_TO_CALIDOSOS"))) {return res.redirect('/no-permission');}

  res.render('b2b/calidosos', {'session': req.session});
}

controller.historialTransacciones = async (req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8065_VIEW_ECOMMERCE"))) {return res.redirect('/no-permission');}

  res.render('b2b/historial-transacciones', {'session': req.session});
}

controller.historialFacturas = async (req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8010_CAN_VIEW_DOCUMENT_HISTORY_EXTRANET"))) {return res.redirect('/no-permission');}

  res.render('b2b/historial-facturas', {'session': req.session});
}

controller.historialPedidos = async (req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8020_CAN_VIEW_ORDERS_EXTRANET"))) {return res.redirect('/no-permission');}

  res.render('b2b/historial-pedidos', {'session': req.session});
}

controller.cotizaciones = async (req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8015_CAN_VIEW_QUOTATION_EXTRANET"))) {return res.redirect('/no-permission');}

  res.render('b2b/cotizaciones', {'session': req.session});
}

controller.certificados = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login')}
  if (!(hasPermission(req.session.user.permission ,"8025_CAN_EXPORT_CERTIFICATES_EXTRANET"))) {return res.redirect('/no-permission');}
  
  res.render('b2b/certificados', {'session': req.session});
}

controller.retenciones = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8030_CAN_CONFIGURE_EXTRANET"))) {return res.redirect('/no-permission');}
  
  res.render('b2b/retenciones', {'session': req.session});
}

controller.usuarios = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8030_CAN_CONFIGURE_EXTRANET"))) {return res.redirect('/no-permission');}
  
  res.render('usuarios', {'session': req.session});
}

controller.facturas = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8035_CAN_VIEW_PORTFOLIO_EXTRANET"))) {return res.redirect('/no-permission');}

  res.render('b2b/facturas', {'session': req.session});
}

controller.carritoCompras = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  // if (!(hasPermission(req.session.user.permission ,"8045_CAN_VIEW_SHOPPING_CAR"))) {return res.redirect('/no-permission');} // TODO permiso comentado por desarrollo catalogo grulla
  
  res.render('b2b/carrito-compras', {'session': req.session});
}

controller.carritoFacturas = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8005_CAN_PAY_INVOICES_EXTRANET"))) {return res.redirect('/no-permission');}
   
  res.render('b2b/carrito-facturas', {'session': req.session}); 
}

controller.permisos = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  if ((req.session.user.type_user == "5100_CAN_ACCESS_PERMISSIONS")) {return res.redirect('/no-permission');}

  res.render('permisos', {'session': req.session});
}

controller.documentosUsuario = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login')}

  res.render('documentos-usuario', {'session': req.session});
}

controller.catalogo = async (req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  // if (!(hasPermission(req.session.user.permission ,"8045_CAN_VIEW_SHOPPING_CAR"))) {return res.redirect('/no-permission');} // TODO comentado por desarrollo GyW

  if (req.session.user.id == 12790) { // TODO usuario vpareja acceso catalogo GyW
    res.render('b2b/catalogo_v2', {'session': req.session});
  } else {
    res.render('b2b/catalogo', {'session': req.session});
  }
}

controller.catalogoTop = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8029_VIEW_TOP_50_PRODUCTS"))) {return res.redirect('/no-permission');}

  res.render('b2b/catalogo-top50', {'session': req.session});
}

controller.catalogoAdministrador = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  // if (!(hasPermission(req.session.user.permission ,"8029_VIEW_TOP_50_PRODUCTS"))) {return res.redirect('/no-permission');}

  res.render('b2b/administrador-catalogo', {'session': req.session});
}

// ** Herramientas
controller.dashboard = async (req, res, next) => {
  if (!req.session.login) { return res.redirect('/login');}
  if (!(hasPermission(req.session.user.permission ,"6200_CAN_ACCESS_DASHBOARD"))) {return res.redirect('/no-permission');}

  res.render('dashboard', {'session': req.session})
} 

controller.chat = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }

  service.removeNotificationByKind(req.session.user.id, 5); // Delete all messages notification when enter to chat
  
  res.render('chat', {'session': req.session, "id_chat": false});
}

controller.chatOpenConversation = async(req, res, next) => { // open specific chat
  if (!req.session.login) { return res.redirect('/login'); }

  service.removeNotificationByKind(req.session.user.id, 5); 
  
  res.render('chat', {'session': req.session, "id_chat": req.params.id});
}

controller.helpdesk = async (req, res, next) => {
  if (!req.session.login) { return res.redirect('/login');}
  if (!(hasPermission(req.session.user.permission ,"4000_CAN_ACCESS_HELPDESK"))) {return res.redirect('/no-permission');}

  res.render('helpdesk', {'session': req.session})
} 

controller.agenda = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"4500_CAN_ACCESS_CALENDAR"))) {return res.redirect('/no-permission');}

  res.render('agenda', {'session': req.session});
}

controller.recorridos = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"9000_CAN_ACCESS_ROUTES"))) {return res.redirect('/no-permission');}

  res.render('maps/recorridos', {'session': req.session, 'seller_id': false});
}

controller.recorridoSeller = async(req, res, next) => { // Open specific route
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"9000_CAN_ACCESS_ROUTES"))) {return res.redirect('/no-permission');}

  res.render('maps/recorridos', {'session': req.session, 'seller_id': req.params.id_seller});
}

//** Vistas no integradas
controller.crm = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }
  
  res.render('crm', {'session': req.session});
}

module.exports = controller