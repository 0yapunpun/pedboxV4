const controller = {};
const userController = require('../controller/usersController.js');
const service = require('../engine/apiService.js');
const config = require('../engine/config.js');
const { nvFormatCash, hasPermission} = require('./helpers.js');
const _ = require('underscore');
const moment = require('moment');
const path = require('path')

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

    return res.send({success: true, data: strB64})
  } catch (error) {
    return res.send({success: false, data: []})
  }
}

controller.PDFFacturasUR = async(req, res, next) => {  
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
      console.log(strB64)
      var dataBuffer = Buffer.from(strB64, 'base64');
      console.log(dataBuffer);
      //let name = new Date().getTime();
      let route = "../public/PDFs/"+idFactura+".pdf"
      require("fs").writeFile(path.join(__dirname, route), dataBuffer, function(err) {
          if(err){
              return res.status(500).send({message: err});
          }else{
              let pdf = {
                  "name": idFactura+".pdf",
                  "route": route,
                  "url": "http://api.pedbox.co:4040/PDFs/"+idFactura+".pdf"
              }
              return res.status(200).send(pdf);
              }
      });
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

controller.catalogoLimit = async (req, res, next) => {
  let id_company = req.session.user.id_company;

  let products = await service.productosLimit(id_company);

  res.send(products)
}

controller.catalogoFilter = async (req, res, next) => {
  let id_company = req.session.user.id_company;
  let word = req.body.text;

  let products = await service.productosFilter(id_company, word);

  res.send(products)
}

controller.catalogItem = async (req, res, next) => {
  let id_product = req.params.id_product;

  let product = await service.productosById(id_product);

  res.send(product)
}


controller.catalogItemUpdate = async (req, res, next) => {
  let body = req.body;

  let response = await service.productosUpdate(body);

  res.send(response)
}

controller.catalogImages = async (req, res, next) => {
  let id_company = req.session.user.id_company;

  let response = await service.imagenesProductosServicePB4(id_company);

  res.send(response)
}

controller.catalogAttachments = async (req, res, next) => {
  let id_company = req.session.user.id_company;

  let response = await service.catalogAttachments(id_company);

  res.send(response)
}

controller.deleteAttachmentsByIdItem = async (req, res, next) => {
  let id_item = req.params.id_item;
  let id_company = req.session.user.id_company;

  let response = await service.deleteAttachmentsByIdItem(id_item, id_company);

  res.send(response)
}

controller.catalogCodes = async (req, res, next) => {
  let id_company = req.session.user.id_company;
  let response = await service.getCodesCatalog(id_company);

  res.send(response)
}

controller.catalogCodesSubstring = async (req, res, next) => {
  let id_company = req.session.user.id_company;
  let response = await service.getCodesSubstringCatalog(id_company);

  res.send(response)
}

controller.catalogRemoveImg = async (req, res, next) => {
  let id_company = req.session.user.id_company;
  let code = req.params.code;

  let response = await service.catalogRemoveImg(code, id_company);

  res.send(response)
}

controller.catalogAddImg = async (req, res, next) => {
  let response = await service.catalogAddImg(req.body);

  res.send(response)
}

controller.catalogAddRelateImageArray = async (req, res, next) => {
  let response = await service.catalogAddRelateImageArray(req.body);

  res.send(response)
}

controller.catalogProductsByCode = async (req, res, next) => {
  let code = req.params.code;
  let id_company = req.session.user.id_company;

  let response = await service.catalogProductsByCode(code, id_company);

  res.send(response)
}

controller.catalogItemsAtributes = async (req, res, next) => {
  let id_company = req.session.user.id_company;

  let response = await service.catalogItemsAtributes(id_company);

  res.send(response)
}


controller.catalogImagesAttachments = async (req, res, next) => {
  let string = req.params.string;

  let response = await service.catalogImagesAttachment(string);

  res.send(response)
}

controller.imagesItemsByCodeColor = async (req, res, next) => {
  let code = req.params.code;
  let code_color = req.params.code_color;

  let response = await service.catalogItemsByCodeColor(code, code_color);

  if (response.result.success) {
    if (response.result.result) {
      return res.send(response.result.result[0])
    }
  }

  res.send(false)
}

controller.catalogItemsAtributesCreate = async (req, res, next) => {
  let body = req.body;
  let response = await service.catalogItemsAtributesCreate(body);
  res.send(response)
}

controller.catalogItemsAtributesUpdate = async (req, res, next) => {
  let body = req.body;
  let response = await service.catalogItemsAtributesUpdate(body);
  res.send(response)
}

controller.catalogItemsAtributesDetailCreate = async (req, res, next) => {
  let body = req.body;
  let response = await service.catalogItemsAtributesDetailCreate(body);
  res.send(response)
}

controller.catalogItemsAtributesDetailUpdate = async (req, res, next) => {
  let body = req.body;
  let response = await service.catalogItemsAtributesDetailUpdate(body);
  res.send(response)
}

controller.catalogItemsAtributesDelete = async (req, res, next) => {
  let body = { id: req.params.id_attr}

  let response = await service.catalogItemsAtributesDelete(body);

  res.send(response)
}

controller.catalogItemsAtributesDetailDelete = async (req, res, next) => {
  let body = { id: req.params.id_attr}

  let response = await service.catalogItemsAtributesDetailDelete(body);

  res.send(response)
}

controller.getCodesAssociateToAttribute = async (req, res, next) => {
  let attribute_id = req.params.id_attr;

  let response = await service.getCodesAssociateToAttribute(attribute_id);
  res.send(response)
}

controller.getCodesAssociateToAttribute = async (req, res, next) => {
  let attribute_id = req.params.id_attr;

  let response = await service.getCodesAssociateToAttribute(attribute_id);
  res.send(response)
}

controller.relateAttributesBySubstring = async (req, res, next) => {
  let response = await service.relateAttributesBySubstring(req.body);
  res.send(response)
}

controller.deleteAssociatedAttribute = async (req, res, next) => {
  let id_attribute = req.params.id_attr;
  let code = req.params.code;
  let id_company = req.session.user.id_company;

  let response = await service.deleteCodesAssociatedToAttribute(id_attribute, code, id_company);
  res.send(response)
}

controller.deleteAttributeAssociated = async (req, res, next) => {
  let id_attribute = req.params.id_attr;
  let id_item = req.params.id_item;

  let response = await service.deleteAttributeAssociated(id_attribute, id_item);
  res.send(response)
}

controller.deleteAttachmentDetailAttribute = async (req, res, next) => {
  let id_image = req.params.id_image;
  let id_attribute = req.params.id_attribute;

  let response = await service.deleteAttachmentDetailAttribute(id_image, id_attribute);
  res.send(response)
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

controller.getAttrItemById = async(req, res, next) => {
  let catalog = await service.getAttrItemById(req.params.id);
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
  
  if (req.session.address) {
    return res.send({"address": req.session.address});
  } else {
    let address = await service.informacionVendedor(id_person);
    req.session.address = address
    return res.send({"address": address});
  }
}

controller.sendCarritoCompras = async(req, res, next) => {
  let data = req.body;
  let response = await service.sendCarritoCompras(data);
  res.send({"response": response})
}

controller.sendCarritoFacturas = async(req, res, next) => {
  let data = req.body;
  let response = await service.sendCarritoFacturas(data);
  res.send(response)
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
