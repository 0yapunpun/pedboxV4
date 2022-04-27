const controller = {};
const userController = require('../controller/usersController.js');
const service = require('../engine/apiService.js');
const config = require('../engine/config.js');
const { nvFormatCash, hasPermission } = require('./helpers.js');
const _ = require('underscore');
const multer  = require('multer');
const moment = require('moment');
const { response, request } = require('express');

var now = Date.now();

controller.calidosos = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login');}
  if (!(hasPermission(req.session.user.permission ,"8028_CAN_ACCESS_TO_CALIDOSOS"))) {return res.redirect('/no-permission');}

  let body = {"doc": req.session.user.nit};
  let puntos = await service.calidosos(body);

  res.render('b2b/calidosos', {'session': req.session, 'puntos': puntos});
}

controller.historialTransacciones = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8065_VIEW_ECOMMERCE"))) {return res.redirect('/no-permission');}

  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let historial = await service.historialTransacciones(url_company, id_company, nit);

  res.render('b2b/historial-transacciones', {'session': req.session, 'historial': historial});
}

controller.historialFacturas = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8010_CAN_VIEW_DOCUMENT_HISTORY_EXTRANET"))) {return res.redirect('/no-permission');}

  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let facturas = await service.historialFacturas(url_company, nit, id_company);
  let recibos = await service.historialRecibos(url_company, nit, id_company);
  let notas = await service.historialNotas(url_company, nit, id_company);

  res.render('b2b/historial-facturas', {'session': req.session, 'facturas': facturas, "recibos": recibos, "notas": notas});
}

controller.facturas = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8035_CAN_VIEW_PORTFOLIO_EXTRANET"))) {return res.redirect('/no-permission');}

  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let facturas = await service.historialFacturas(url_company, nit, id_company);
  
  res.render('b2b/facturas', {'session': req.session, 'facturas': facturas});
}

// Las facturas de universal de respuesto tienen un tratamiento diferente
controller.extranetFacturasUR = async(req, res, next) => {  
  let idFactura = req.params.id_factura;
  let factura = await service.faturaUR(req.params.id_factura);

  try {
    factura = factura.result.elements[0].elements[0].elements[0].elements[0].elements[1].elements[0].elements[0].elements;
  } catch (error) {
    factura = [];
  }

  res.send(factura)
}

controller.historialPedidos = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8020_CAN_VIEW_ORDERS_EXTRANET"))) {return res.redirect('/no-permission');}

  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;
  let id_person = req.session.user.id_person;

  let facturas = await service.historialFacturas(url_company, nit, id_company);
  let pedidos = await service.historialPedidos(url_company, nit, id_company);
  let vendedor = await service.informacionVendedor(id_person);


  res.render('b2b/historial-pedidos', {'session': req.session, 'vendedor': vendedor, 'facturas': facturas, 'pedidos': pedidos});
}

controller.cotizaciones = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8015_CAN_VIEW_QUOTATION_EXTRANET"))) {return res.redirect('/no-permission');}

  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;
  let id_person = req.session.user.id_person;

  let facturas = await service.historialFacturas(url_company, nit, id_company);
  let vendedor = await service.informacionVendedor(id_person);

  // res.render('catalogo', {'session': req.session});
  res.render('b2b/cotizaciones', {'session': req.session, 'vendedor': vendedor, 'facturas': facturas});
}

controller.historialPedidosDetalle = async (req, res, next) => {
  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let numero = req.params.numero;

  let detalle = await service.detallePedido(url_company, numero);
      detalle = detalle.result.report.Table;

  console.time()
  
  let itemsDetail = [];
  for (let i = 0; i < detalle.length; i++) {
    let item = await service.detalleProductos(id_company, detalle[i].codigo);
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

  console.timeEnd()

  res.send({'detalle': itemsDetail});
}

controller.historialPedidosPedido = async (req, res, next) => {
  let body = req.body;
  let response = await service.sendCarritoCompras(body);
  res.send({"response": response})
}

controller.nuevoPedido = async (req, res, next) => {
  let id_company = req.session.user.id_company;
  let codigo = req.params.codigo;

  let productos = await service.detalleProductos(id_company, codigo);
  res.send({"productos": productos})
}

controller.getInfoVendedor = async (req, res, next) => {
  let id_person = req.params.id;

  let info = await service.informacionVendedor(id_person);
  res.send({'vendedor': info});
}

controller.catalogo = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8045_CAN_VIEW_SHOPPING_CAR"))) {return res.redirect('/no-permission');}

  let isGyW = false; // TODO remplazar por id company GyW cuando ya tengan permisos para el catalogo 
  if (isGyW) { 
    res.render('b2b/catalogo_v2', {'session': req.session});
  } else {
    res.render('b2b/catalogo', {'session': req.session});
  }
}

controller.catalogoProductos = async (req, res, next) => {
  let id_company = req.session.user.id_company;
  let url_company = req.session.user.dataCompany[0].Url;
  let nit = req.session.user.nit;
  
  let productos = await service.productos(url_company, nit, id_company);
  let images = await service.imagenesProductos(id_company);

  let items = productos.result.extranet.Table;
  images = images.result.data;

  try {
    items.forEach(item => {
      item.qty = 1;
      let imagen = images.find(a => a.code === item.codigo);
      item.imagen = (imagen != undefined) ? imagen.image : null;
      item.format_precio = nvFormatCash(item.precio, '$', 0);
    });
  
    for(let item of items) {
      ['marca', 'modelo', 'categoria_x002F_parte', 'fabricante'].forEach((v) => {
        item[v] = item[v] || '';
      });
      item['stock'] = 0;
      if (item['Medellin']) {
        [
          'Medellin', 'Bogota', 'Barranquilla', 'Cali', 'Cali_x0020_Salonia',
          'Medellin_x0020_transito', 'Bogota_x0020_transito',
          'Barranquilla_x0020_transito', 'Preguntar_x0020_Disponibilidad'
        ].forEach((v) => {
          item[v] = parseInt(item[v] || '0');
          item['stock'] += parseInt(item['cantidad']);
        });
      } else {
        item['stock'] = parseInt(item['cantidad']);
      }
    }
  } catch (error) {
    items = []
  }
  res.send({"items":items})
}

controller.catalogoTop = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8029_VIEW_TOP_50_PRODUCTS"))) {return res.redirect('/no-permission');}

  let id_company = req.session.user.id_company;
  let url_company = req.session.user.dataCompany[0].Url;
  let nit = req.session.user.nit;

  let productos = await service.topProductos(url_company, nit, id_company);
  let images = await service.imagenesProductos(id_company);

  let items = productos.result.extranet.Table;
  images = images.result.data;

  try {
    items.forEach(item => {
      item.qty = 1;
      let imagen = images.find(a => a.code === item.codigo);
      item.imagen = (imagen != undefined) ? imagen.image : null;
      item.format_precio = nvFormatCash(item.precio, '$', 0)
    });
    for(let item of items) {
      ['marca', 'modelo', 'categoria_x002F_parte', 'fabricante'].forEach((v) => {
        item[v] = item[v] || '';
      });
      item['stock'] = 0;
      if (item['Medellin']) {
        [
          'Medellin', 'Bogota', 'Barranquilla', 'Cali', 'Cali_x0020_Salonia',
          'Medellin_x0020_transito', 'Bogota_x0020_transito',
          'Barranquilla_x0020_transito', 'Preguntar_x0020_Disponibilidad'
        ].forEach((v) => {
          item[v] = parseInt(item[v] || '0');
          item['stock'] += parseInt(item['cantidad']);
        });
      } else {
        item['stock'] = parseInt(item['cantidad']);
      }
    }
  } catch (error) {
    console.log(error)
    items = [];
  }
  res.render('b2b/catalogo-top50', {'session': req.session, 'productos': items});
}

controller.catalogColors = async(req, res, next) => {
  let colores = await service.catalogColors(req.session.user.id_company);
  res.send(colores.result);
}

controller.catalogGyW = async(req, res, next) => {
  let catalog = await service.getCatalogGyW();
  res.send(catalog.result);
}

controller.catalogDetailGyW = async(req, res, next) => {
  let code = req.params.code;
  let catalog = await service.getCatalogDetailGyW(req.session.user.id_company, code);
  res.send(catalog.result);
}

controller.certificados = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login')}
  if (!(hasPermission(req.session.user.permission ,"8025_CAN_EXPORT_CERTIFICATES_EXTRANET"))) {return res.redirect('/no-permission');}
  
  res.render('b2b/certificados', {'session': req.session});
}

controller.retenciones = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8030_CAN_CONFIGURE_EXTRANET"))) {return res.redirect('/no-permission');}

  let id_company = req.session.user.id_company;
  let id_country = req.session.user.id_country;

  let retenciones = await service.getRetenciones(id_company, id_country);
  
  res.render('b2b/retenciones', {'session': req.session, 'retenciones': retenciones});
}

controller.retencionesUpdate = async (req, res, next) => {
  let body = req.body;

  let response = await service.updateRetencion(body);
  res.send({"response": response})
}

controller.retencionesCreate = async (req, res, next) => {
  let body = req.body;

  let response = await service.createRetencion(body);
  res.send({"response": response})
}

controller.usuarios = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8030_CAN_CONFIGURE_EXTRANET"))) {return res.redirect('/no-permission');}

  let id_company = req.session.user.id_company;
  let id_user_company = req.session.user.id;

  let users = await service.getUsers(id_company, id_user_company);
  let roles = await service.getRoles(id_company, id_user_company);
  
  res.render('usuarios', {'session': req.session, 'users': users, "roles": roles});
}

controller.password = async(req, res, next) => {
  let user = req.session.user.user;
  let password = req.body.currentPass;
  let newPassword = req.body.newPass;

  let body = {
    new_password: newPassword,
    password: password,
    user: user
  }

  let response = await service.updatePassword(body);
  
  res.send({"response": response})
}

controller.updateUser = async(req, res, next) => {
  let body = req.body;
  let response = await service.userUpdate(body);
  
  res.send({"response": response})
}

controller.carritoCompras = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8045_CAN_VIEW_SHOPPING_CAR"))) {return res.redirect('/no-permission');}
  // TODO problema de con permisos del usuario de igb 
  
  let id_person = req.session.user.id_person;
  let address = await service.informacionVendedor(id_person);
  
  res.render('b2b/carrito-compras', {'session': req.session, "address": address});
}

controller.sendCarritoCompras = async(req, res, next) => {
  let data = req.body;
  let response = await service.sendCarritoCompras(data);
  res.send({"response": response})
}

controller.sendCarritoFacturas = async(req, res, next) => {
  let data = req.body;
  let response = await service.sendCarritoFacturas(data);
  res.send({"response": response})
}

controller.carritoFacturas = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8005_CAN_PAY_INVOICES_EXTRANET"))) {return res.redirect('/no-permission');}

  let id_company = req.session.user.id_company;
  let id_country = req.session.user.id_country;

  let retenciones = await service.getRetenciones(id_company, id_country);
   
  res.render('b2b/carrito-facturas', {'session': req.session, "retenciones": retenciones});
}

controller.permisos = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if ((req.session.user.type_user == "E")) {return res.redirect('/no-permission');}
  
  let id_user_company = req.session.user.id;
  let id_company = req.session.user.id_company;

  let permisos = await service.getPermisos(id_company, id_user_company);

  res.render('permisos', {'session': req.session, 'permisos': permisos});
}

controller.getPermisos = async(req, res, next) => {
  let id_user_company = req.session.user.id;
  let id_company = req.session.user.id_company;

  let permisos = await service.getPermisos(id_company, id_user_company);

  res.send({'permisos': permisos});
}

controller.updatePemiso = async(req, res, next) => {
  let body = req.body;
  let response = await service.updatePemiso(body);
  res.send({'response': response});
}

controller.createPermiso = async(req, res, next) => {
  let body = req.body;
  let response = await service.createPermiso(body);
  res.send({'response': response});
}

controller.documentosUsuario = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login')}

  let id_company = req.session.user.id_company;

  let documentos = await service.getDocumentos(id_company);
  let masters = await service.getMastersDocumentos();

  res.render('documentos-usuario', {'session': req.session, 'documentos': documentos, 'masters': masters});
}

controller.uploadDocumentoUsuario = async(req, res, next) => { 
  let response = await service.uploadDocumentoUsuario(req.body);
  res.send({'response': response});
}

controller.deleteDocumentoUsuario = async(req, res, next) => { 
  let response = await service.deleteDocumentoUsuario(req.body);
  res.send(response);
}


module.exports = controller
