const express = require('express');
const router = express.Router();
const viewController = require('../controller/viewController.js');
const b2bController = require('../controller/b2bController.js');

router.get('/', viewController.index);
router.get('/login', viewController.login);
router.post('/login', viewController.loginValidate);
router.get('/logout', viewController.logout);

// b2b
router.get('/calidosos', b2bController.calidosos);
router.get('/historial-transacciones', b2bController.historialTransacciones);
router.get('/historial-facturas', b2bController.historialFacturas);
router.get('/historial-pedidos', b2bController.historialPedidos);
router.post('/historial-pedidos', b2bController.historialPedidosPedido);
router.get('/historial-pedidos/:numero', b2bController.historialPedidosDetalle);
// router.get('/cotizaciones', b2bController.cotizaciones);
router.get('/nuevo-pedido/:codigo', b2bController.nuevoPedido);
router.get('/infoVendedor/:id', b2bController.getInfoVendedor);
router.get('/catalogo', b2bController.catalogo);
router.get('/catalogo/productos', b2bController.catalogoProductos);
router.get('/catalogo/top', b2bController.catalogoTop);
router.get('/certificados', b2bController.certificados);
router.get('/retenciones', b2bController.retenciones);
router.post('/retenciones/update', b2bController.retencionesUpdate);
router.post('/retenciones/create', b2bController.retencionesCreate);
router.get('/usuarios', b2bController.usuarios);
router.post('/usuarios/updatePassword', b2bController.password);
router.post('/usuarios/updateUser', b2bController.updateUser);
router.get('/facturas', b2bController.facturas);
router.get('/carrito-compras', b2bController.carritoCompras);
router.post('/carrito-compras', b2bController.sendCarritoCompras);
router.get('/carrito-facturas', b2bController.carritoFacturas);
router.post('/carrito-facturas', b2bController.sendCarritoFacturas);
router.get('/permisos', b2bController.permisos);
router.post('/permisos', b2bController.updatePemiso);
router.post('/permisos/nuevo-permiso', b2bController.createPermiso);
router.get('/documentos-usuario', b2bController.documentosUsuario);
router.post('/documentos-usuario/upload', b2bController.uploadDocumentoUsuario);

// Por integrar
router.get('/helpdesk', viewController.helpdesk);
router.get('/crm', viewController.crm);


module.exports = router;