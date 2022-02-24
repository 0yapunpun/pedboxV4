const express = require('express');
const router = express.Router();
const viewController = require('../controller/viewController.js');

/* View Routers */
router.get('/', viewController.index);
router.get('/login', viewController.login);
router.get('/logout', viewController.logout);

// B2B
router.get('/calidosos', viewController.calidosos);
router.get('/historial-transacciones', viewController.historialTransacciones);
router.get('/historial-facturas', viewController.historialFacturas);
router.get('/historial-pedidos', viewController.historialPedidos);
router.get('/historial-pedidos/:numero', viewController.historialPedidosDetalle);
router.get('/nuevo-pedido/:codigo', viewController.nuevoPedido);
router.get('/infoVendedor/:id', viewController.getInfoVendedor);
router.get('/catalogo', viewController.catalogo);
router.get('/catalogo/productos', viewController.catalogoProductos);
router.get('/catalogo/top', viewController.catalogoTop);
router.get('/certificados', viewController.certificados);
router.get('/retenciones', viewController.retenciones);
router.post('/retenciones/update', viewController.retencionesUpdate);
router.post('/retenciones/create', viewController.retencionesCreate);
router.get('/usuarios', viewController.usuarios);
router.post('/usuarios/updatePassword', viewController.password);
router.post('/usuarios/updateUser', viewController.updateUser);
router.get('/facturas', viewController.facturas);


// Por integrar
router.get('/carrito-facturas', viewController.carritoFacturas);
router.get('/carrito-compras', viewController.carritoCompras);
router.get('/helpdesk', viewController.helpdesk);
router.get('/crm', viewController.crm);

/* POST Services */
router.post('/login', viewController.loginValidate);

module.exports = router;