const express = require('express');
const router = express.Router();
const viewController = require('../controller/viewController.js');

/* View Routers */
router.get('/', viewController.index);
router.get('/helpdesk', viewController.helpdesk);
router.get('/crm', viewController.crm);
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

// Por integrar
router.get('/retenciones', viewController.retenciones);
router.get('/usuarios', viewController.usuarios);
router.get('/facturas', viewController.facturas);
router.get('/carrito-facturas', viewController.carritoFacturas);
router.get('/carrito-compras', viewController.carritoCompras);



/* POST Services */
router.post('/login', viewController.loginValidate);

module.exports = router;