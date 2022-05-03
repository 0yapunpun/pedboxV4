const controller = {};
const userController = require('../controller/usersController.js');
const service = require('../engine/apiService.js');
const config = require('../engine/config.js');
const { nvFormatCash, hasPermission, dataURItoBlob} = require('./helpers.js');


// var createObjectURL = require('create-object-url');
// import { URL } from 'node:url';
// const URL = require('node:url');
// const {URL} = require('buffer');



const _ = require('underscore');
const moment = require('moment');

var now = Date.now();

controller.calidososData = async (req, res, next) => {
  let puntos = await service.calidosos({"doc": req.session.user.nit});
  res.send({'puntos': puntos});
}

controller.historialTransaccionesData = async (req, res, next) => {
  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let historial = await service.historialTransacciones(id_company, nit);

  res.send({'historial': historial});
}

controller.historialFacturasData = async (req, res, next) => {
  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let facturas = await service.historialFacturas(url_company, nit, id_company);
  let recibos = await service.historialRecibos(url_company, nit, id_company);
  let notas = await service.historialNotas(url_company, nit, id_company);

  res.send({'facturas': facturas, "recibos": recibos, "notas": notas});
}

controller.facturasData = async(req, res, next) => {
  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let facturas = await service.historialFacturas(url_company, nit, id_company);
  
  res.send({'facturas': facturas});
}


controller.extranetFacturasUR = async(req, res, next) => {  
  let idFactura = req.params.id_factura;
  let factura = await service.faturaUR(req.params.id_factura);

  try {
    factura = factura.result.elements[0].elements[0].elements[0].elements[0].elements[1].elements[0].elements[0].elements;
    let strB64 = "";

    for (let i = 0; i < factura.length; i++) {
      if (factura[i].elements) {
        strB64 += factura[i].elements[0].text
      }
    }

    const blob = dataURItoBlob(strB64);
    factura = blob;
    return res.send({success: true, data: factura})
  } catch (error) {
    return res.send({success: false, data: []})
  }
}

controller.historialPedidosData = async (req, res, next) => {
  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;

  let facturas = await service.historialFacturas(url_company, nit, id_company);
  let pedidos = await service.historialPedidos(url_company, nit, id_company);

  res.send({'facturas': facturas, 'pedidos': pedidos})
}

controller.cotizacionesData = async (req, res, next) => {
  let url_company = req.session.user.dataCompany[0].Url;
  let id_company = req.session.user.id_company;
  let nit = req.session.user.nit;
  let id_person = req.session.user.id_person;

  let facturas = await service.historialFacturas(url_company, nit, id_company);
  let vendedor = await service.informacionVendedor(id_person);

  res.send({'vendedor': vendedor, 'facturas': facturas});
}

controller.historialPedidosDetalle = async (req, res, next) => {
  let url_company = req.session.user.dataCompany[0].Url;
  
  let numero = req.params.numero;

  let detalle = await service.detallePedido(url_company, numero);
      detalle = detalle.result.report.Table;

  let itemsDetail = [];
  for (let i = 0; i < detalle.length; i++) {
    itemsDetail.push({
      'codigo': detalle[i].codigo,
      'descripcion': detalle[i].descripcion,
      'cantidad': detalle[i].cantidad,
      'precio': detalle[i].valor_unitario,
      'descuento': "",
      'por_desc': detalle[i].porcentaje_descuento,
      'qty': detalle[i].cantid1htCash(detalle[i].valor_unitario, '$', 0),
      "porcentaje_iva": detalle[i].porcentaje_iva,
      'isCopy': true
    });
  }

  res.send({'detalle': itemsDetail});
}

controller.productosImagenes = async (req, res, next) => {
  let id_company = req.session.user.id_company;
  let products = req.body;
  console.log(products)

  for (let i = 0; i < products.length; i++) {
    let item = await service.detalleProductos(id_company, products[i].codigo);
        item = item.result.items[0];

    products[i].imagen = item.image;
  }

  res.send(products);
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

  if (req.session.user.infoVendedor) {
    res.send({'vendedor': req.session.user.infoVendedor});
  } else {
    let info = await service.informacionVendedor(id_person);
    req.session.user.infoVendedor = info;
    res.send({'vendedor': info});
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

controller.catalogoTopData = async (req, res, next) => {
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
  res.send({'productos': items});
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

controller.retencionesData = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let id_country = req.session.user.id_country;

  let retenciones = await service.getRetenciones(id_company, id_country);
  
  res.send({'retenciones': retenciones});
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

controller.usuariosData = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let id_user_company = req.session.user.id;

  let users = await service.getUsers(id_company, id_user_company);
  let roles = await service.getRoles(id_company, id_user_company);
  
  res.send({'users': users, "roles": roles});
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

controller.carritoComprasData = async(req, res, next) => {
  let id_person = req.session.user.id_person;
  let address = await service.informacionVendedor(id_person);
  
  res.send({"address": address});
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

controller.carritoFacturasData = async(req, res, next) => {
  let id_company = req.session.user.id_company;
  let id_country = req.session.user.id_country;

  let retenciones = await service.getRetenciones(id_company, id_country);
   
  res.send({"retenciones": retenciones});
}

controller.permisosData = async(req, res, next) => {
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

controller.documentosUsuarioData = async(req, res, next) => {
  let id_company = req.session.user.id_company;

  let documentos = await service.getDocumentos(id_company);
  let masters = await service.getMastersDocumentos();

  res.send({'documentos': documentos, 'masters': masters});
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
