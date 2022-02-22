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


/* POST Services */
router.post('/login', viewController.loginValidate);

module.exports = router;