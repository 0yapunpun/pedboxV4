const express = require('express');
const router = express.Router();
const viewController = require('../controller/viewController.js');
const userController = require('../controller/usersController.js');
const notificationsController = require('../controller/notificationController.js');
const b2bController = require('../controller/b2bController.js');
const helpdeskController = require('../controller/helpdeskController.js');
const agendaController = require('../controller/agendaController.js');
const dashboardController = require('../controller/dashboardController.js');

//** user
router.get('/', viewController.login);
router.post('/', userController.loginValidate);
router.get('/login', viewController.login);
router.post('/login', userController.loginValidate);
router.get('/login/:token', viewController.login);
router.post('/login/:token', userController.loginValidate);
router.get('/logout', userController.logout);
router.get('/no-permission', viewController.noPermission);

//**  B2B - extranet
router.get('/calidosos', viewController.calidosos);
router.get('/calidosos/data', b2bController.calidososData);

router.get('/historial-transacciones', viewController.historialTransacciones);
router.get('/historial-transacciones/data', b2bController.historialTransaccionesData);

router.get('/historial-facturas', viewController.historialFacturas); // aka Historial-documentos
router.get('/historial-facturas/data', b2bController.historialFacturasData);

router.get('/historial-pedidos', viewController.historialPedidos);
router.get('/historial-pedidos/data', b2bController.historialPedidosData);
router.post('/historial-pedidos', b2bController.historialPedidosPedido);
router.get('/historial-pedidos/:numero', b2bController.historialPedidosDetalle);

router.get('/cotizaciones', viewController.cotizaciones);
router.get('/cotizaciones/data', b2bController.cotizacionesData);
router.get('/nuevo-pedido/:codigo', b2bController.nuevoPedido);
router.get('/infoVendedor/:id', b2bController.getInfoVendedor);

router.get('/certificados', viewController.certificados); 

router.get('/retenciones', viewController.retenciones);
router.get('/retenciones/data', b2bController.retencionesData);
router.post('/retenciones/update', b2bController.retencionesUpdate);
router.post('/retenciones/create', b2bController.retencionesCreate);

router.get('/usuarios', viewController.usuarios);
router.get('/usuarios/data', b2bController.usuariosData);
router.post('/usuarios/updatePassword', b2bController.password);
router.post('/usuarios/updateUser', b2bController.updateUser);

router.get('/facturas', viewController.facturas);
router.get('/facturas/data', b2bController.facturasData);
router.get('/facturas/universal_repuestos/:id_factura', b2bController.extranetFacturasUR);
router.get('/facturas/universal_repuestos/pdf/:id_factura', b2bController.PDFFacturasUR);

router.get('/carrito-compras', viewController.carritoCompras);
router.get('/carrito-compras/data', b2bController.carritoComprasData);
router.post('/carrito-compras', b2bController.sendCarritoCompras);

router.get('/carrito-facturas', viewController.carritoFacturas);
router.get('/carrito-facturas/data', b2bController.carritoFacturasData);
router.post('/carrito-facturas', b2bController.sendCarritoFacturas);

router.get('/permisos', viewController.permisos);
router.get('/permisos/data', b2bController.permisosData);
router.post('/permisos', b2bController.updatePemiso);
router.post('/permisos/nuevo-permiso', b2bController.createPermiso);

router.get('/documentos-usuario', viewController.documentosUsuario);
router.get('/documentos-usuario/data', b2bController.documentosUsuarioData);
router.post('/documentos-usuario/upload', b2bController.uploadDocumentoUsuario);
router.post('/documentos-usuario/delete', b2bController.deleteDocumentoUsuario);

router.get('/catalogo', viewController.catalogo);
router.get('/catalogo/top', viewController.catalogoTop);
router.get('/catalogo/administrador', viewController.catalogoAdministrador);
router.get('/catalogo/productos', b2bController.catalogoProductos);
router.get('/catalogo/productos/limit', b2bController.catalogoLimit);
router.post('/catalogo/productos/filter', b2bController.catalogoFilter);
router.get('/catalogo/productById/:id_product', b2bController.catalogItem);
router.post('/catalogo/productUpdate', b2bController.catalogItemUpdate);
router.get('/catalogo/productsImages', b2bController.catalogImages);
router.get('/catalogo/productsAttachments', b2bController.catalogAttachments);
router.get('/catalogo/codes', b2bController.catalogCodes);
router.get('/catalogo/codesSubstring', b2bController.catalogCodesSubstring);
router.get('/catalogo/productsByCode/:code', b2bController.catalogProductsByCode);
router.get('/catalogo/removeImg/:code', b2bController.catalogRemoveImg);
router.post('/catalogo/addImg', b2bController.catalogAddImg);
router.post('/catalogo/relateImageArray', b2bController.catalogAddRelateImageArray);

router.get('/catalogo/getAttributes', b2bController.catalogItemsAtributes);
router.post('/catalogo/createAttribute', b2bController.catalogItemsAtributesCreate);
router.post('/catalogo/updateAttribute', b2bController.catalogItemsAtributesUpdate);
router.post('/catalogo/createAttributeDetail', b2bController.catalogItemsAtributesDetailCreate);
router.post('/catalogo/updateAttributeDetail', b2bController.catalogItemsAtributesDetailUpdate);
router.get('/catalogo/deleteAttributes/:id_attr', b2bController.catalogItemsAtributesDelete);
router.get('/catalogo/deleteAttributesDetail/:id_attr', b2bController.catalogItemsAtributesDetailDelete);

router.get('/catalogo/deleteAttributeAssociated/:id_attr/:id_item', b2bController.deleteAttributeAssociated); //HERE

router.get('/catalogo/getCodesAssociateToAttribute/:id_attr', b2bController.getCodesAssociateToAttribute);
router.post('/catalogo/relateAttributesBySubstring', b2bController.relateAttributesBySubstring);
router.get('/catalogo/deleteAttributeAssociated/:id_attr/:code', b2bController.deleteAssociatedAttribute);



router.get('/catalogo/imagesAttachment/:string', b2bController.catalogImagesAttachments);
router.get('/catalogo/imagesItemsByCodeColor/:code/:code_color', b2bController.imagesItemsByCodeColor);


router.get('/catalogo/top/data', b2bController.catalogoTopData);
router.get('/catalogo/colors', b2bController.catalogColors);
router.post('/catalogo/img', b2bController.productosImagenes);
router.get('/catalogo/GyW', b2bController.catalogGyW); 
router.get('/catalogo/GyW/detail/:code', b2bController.catalogDetailGyW); 

//** Herramientas
router.get('/dashboard', viewController.dashboard);
router.get('/dashboard/data/:dStart/:dEnd/:user', dashboardController.dashboardData);
router.get('/dashboard/reportSeller/:dStart/:dEnd/:seller', dashboardController.dashboardReportSeller);
router.get('/dashboard/clientsSeller/:dStart/:dEnd/:seller', dashboardController.dashboardClientsSeller);



router.get('/chat', viewController.chat);
router.get('/chat/chatId/:id', viewController.chatOpenConversation);

router.get('/helpdesk', viewController.helpdesk);
router.get('/helpdesk/data', helpdeskController.helpdeskData);
router.get('/helpdesk/indicators', helpdeskController.helpdeskIndicators);
router.get('/helpdesk/solicitudes', helpdeskController.helpdeskSolicitudes);
router.get('/helpdesk/ocurrence/:state/:ocurrence', helpdeskController.helpdeskOcurrence);
router.get('/helpdesk/formatRead/:id_answer_format', helpdeskController.helpdeskFormatRead);
router.get('/helpdesk/detailfFormat/:id', helpdeskController.helpdeskFormatReadById);
router.get('/helpdesk/detail/:id/:id_node/:id_workflow_header/:id_workflow/:id_activitie/:id_format_answer', helpdeskController.helpdeskDetail);
router.get('/helpdesk/newFormat/:id/:id_node/:id_workflow_header', helpdeskController.helpdeskNewFormat);
router.get('/helpdesk/editFormat/:id/:id_header', helpdeskController.helpdeskEditFormat);
router.get('/helpdesk/worflow/:id_company/:id_area', helpdeskController.helpdeskWorkflow);
router.get('/helpdesk/takeOcurrence/:id_activitie/:id_user_take', helpdeskController.helpdeskTakeOcurrence);
router.post('/helpdesk/proceso', helpdeskController.helpdeskProceso);
router.post('/helpdesk/formatPost', helpdeskController.helpdeskPostFormat);
router.post('/helpdesk/formatPut', helpdeskController.helpdeskUpdateFormat);
router.post('/helpdesk/startWorkflow', helpdeskController.helpdeskStartWorkflow);
router.post('/helpdesk/continueWorkflow', helpdeskController.helpdeskContinueWorkflow);

router.get('/agenda', viewController.agenda);
router.get('/agenda/data/:date', agendaController.agendaData);
router.post('/agenda/createEvent', agendaController.agendaCreateEvent);
router.post('/agenda/updateEvent', agendaController.agendaUpdateEvent);
router.post('/agenda/createEventRepeat', agendaController.agendaCreateEventRepeat);
router.get('/agenda/deleteEvent/:id', agendaController.agendaDeleteEvent);
router.get('/agenda/getData/:date_begin/:date_end', agendaController.agendaGetData);
router.post('/agenda/eventState', agendaController.agendaChangeEventState);

//**  Notifications
router.get('/getNotifications/:id_user', notificationsController.getNotification);
router.get('/removeNotificationByKind/:id_user/:kind', notificationsController.removeNotificationByKind);
router.post('/createNotification', notificationsController.createNotification);

// ** pendiente
router.get('/crm', viewController.crm);


module.exports = router;