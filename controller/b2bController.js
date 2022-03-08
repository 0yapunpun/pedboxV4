const controller = {};
const userController = require('../controller/usersController.js');
const service = require('../engine/apiService.js');
const config = require('../engine/config.js');
const { nvFormatCash, hasPermission } = require('./helpers.js');
const _ = require('underscore');
const multer  = require('multer');
const moment = require('moment');
const { response } = require('express');

var now = Date.now();

var stoaregeDocumentoUsuario = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, config.urlBase+'/public/img/documentos-usuario');
  },
  filename: function (req, file, callback) {
      var name = now+'-'+file.originalname;
      callback(null, name);
  }
});
var uploadDocumentoUsuario = multer({ storage: stoaregeDocumentoUsuario }).single('file');

controller.calidosos = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login');}
  if (!(hasPermission(req.session.user.permission ,"8028_CAN_ACCESS_TO_CALIDOSOS"))) {return res.redirect('/no-permission');}

  let body = {"doc": req.session.user.nit};
  let puntos = await service.calidosos(body);

  res.render('calidosos', {'session': req.session, 'puntos': puntos});
}

controller.historialTransacciones = async (req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8065_VIEW_ECOMMERCE"))) {return res.redirect('/no-permission');}

  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let historial = await service.historialTransacciones(url_company, id_company, nit);

  res.render('historial-transacciones', {'session': req.session, 'historial': historial});
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

  res.render('historial-facturas', {'session': req.session, 'facturas': facturas, "recibos": recibos, "notas": notas});
}

controller.facturas = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8035_CAN_VIEW_PORTFOLIO_EXTRANET"))) {return res.redirect('/no-permission');}

  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let facturas = await service.historialFacturas(url_company, nit, id_company);
  
  res.render('facturas', {'session': req.session, 'facturas': facturas});
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


  res.render('historial-pedidos', {'session': req.session, 'vendedor': vendedor, 'facturas': facturas, 'pedidos': pedidos});
}

controller.historialPedidosDetalle = async (req, res, next) => {
  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let numero = req.params.numero;

  let detalle = await service.detallePedido(url_company, numero);
      detalle = detalle.result.report.Table;

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
  
  res.render('catalogo', {'session': req.session});
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
    console.log(error)
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
  res.render('catalogo-top50', {'session': req.session, 'productos': items});
}

controller.certificados = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login')}
  if (!(hasPermission(req.session.user.permission ,"8025_CAN_EXPORT_CERTIFICATES_EXTRANET"))) {return res.redirect('/no-permission');}
  
  res.render('certificados', {'session': req.session});
}

controller.retenciones = async(req, res, next) => {
  // Validar login
  if (!req.session.login) { return res.redirect('/login'); }
  if (!(hasPermission(req.session.user.permission ,"8030_CAN_CONFIGURE_EXTRANET"))) {return res.redirect('/no-permission');}

  let id_company = req.session.user.id_company;
  let id_country = req.session.user.id_country;

  let retenciones = await service.getRetenciones(id_company, id_country);
  
  res.render('retenciones', {'session': req.session, 'retenciones': retenciones});
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
  
  res.render('carrito-compras', {'session': req.session, "address": address});
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
   
  res.render('carrito-facturas', {'session': req.session, "retenciones": retenciones});
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
  if (!req.session.login) { return res.redirect('/login'); }

  res.render('documentos-usuario', {'session': req.session});
}

controller.uploadDocumentoUsuario = async(req, res, next) => {
  uploadDocumentoUsuario(req, res, (err) => {
    if (err) { console.log('error uploading image', err); } else {console.log('image uploaded') };
  })
  res.send({'file': now});
}

module.exports = controller
