const controller = {};
const _ = require('underscore');
const userController = require('../controller/usersController.js');
const service = require('../engine/apiService.js');
const moment = require('moment');

controller.login = async(req, res, next) => {
  res.render('login');
}

controller.loginValidate = async(req, res, next) => {
  const resp = await userController.login(req.body);
  if (resp.result=='ok') {
    console.log(resp)
    req.session.login = true;
    req.session.urlSocket = resp.urlSocket;
    req.session.user = resp.user;
    // console.log("session", JSON.stringify(req.session));
    // TODO: Almacenar datos de sesión
    delete resp.user;
    delete resp.urlSocket;
  }
  return res.send(resp);
  
  // let resp = {"result": "ok"}
  // req.session.login = true;
  // return res.send(resp);

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

controller.calidosos = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }

  let body = {"doc": req.session.user.nit};
  let puntos = await service.calidosos(body);

  res.render('calidosos', {'session': req.session, 'puntos': puntos});
}

controller.historialTransacciones = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }

  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let historial = await service.historialTransacciones(url_company, id_company, nit);

  res.render('historial-transacciones', {'session': req.session, 'historial': historial});
}

controller.historialFacturas = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }

  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let facturas = await service.historialFacturas(url_company, nit, id_company);
  let recibos = await service.historialRecibos(url_company, nit, id_company);
  let notas = await service.historialNotas(url_company, nit, id_company);

  res.render('historial-facturas', {'session': req.session, 'facturas': facturas, "recibos": recibos, "notas": notas});
}

controller.historialPedidos = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }

  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let facturas = await service.historialFacturas(url_company, nit, id_company);
  let pedidos = await service.historialPedidos(url_company, nit, id_company)

  res.render('historial-pedidos', {'session': req.session, 'facturas': facturas, 'pedidos': pedidos});
}

controller.historialPedidosDetalle = async (req, res, next) => {
  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let numero = req.params.numero;

  let detalle = await service.detallePedido(url_company, numero);
      detalle = detalle.result.report.Table;

  let itemsDetail = [];
  for (let i = 0; i < detalle.length; i++) {
    let item = await service.repetirPedido(id_company, detalle[i].codigo);
        item = item.result.items[0];

    itemsDetail.push({
        'codigo': item.code,
        'descripcion': item.description,
        'cantidad': detalle[i].cantidad,
        'precio': detalle[i].valor_unitario,
        'descuento': item.discount,
        'por_desc': detalle[i].porcentaje_descuento,
        'qty': detalle[i].cantidad,
        'imagen': item.image,
        'format_precio': nvFormatCash(detalle[i].valor_unitario, '$', 0),
        "porcentaje_iva": detalle[i].porcentaje_iva,
        'isCopy': true
    });
  }
  res.send({'detalle': itemsDetail});
}

function nvFormatCash(
  text = 0,
  pre = "",
  decimal = 2,
  entero = 3,
  sepDecimal = '.',
  sepEntero = ','
) {
  if(typeof(text) == 'string') {
      text = parseFloat(text);
  }
  let regex = '\\d(?=(\\d{' + (entero || 3) + '})+' + (decimal > 0 ? '\\D' : '$') + ')';
  let number = text.toFixed(Math.max(0, ~~decimal));
  let space = (pre != "")? " ": "";
  return pre + space + (sepDecimal ? number.replace('.', sepDecimal) : number).replace(new RegExp(regex, 'g'), '$&' + (sepEntero || ','));
}


module.exports = controller