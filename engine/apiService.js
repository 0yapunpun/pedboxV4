const fetch = require('node-fetch');
const xml_json = require('xml-js')
const { showLog } = require('./helpers');
const service = {};
const urlPedbox = 'http://api.pedbox.co:5037/';
// const urlServicePedbox4 = 'http://localhost:7777/';
const urlServicePedbox4 = 'http://api.pedbox.co:7777/'; 
const urlPedbox1 = 'https://pedbox.co:8531/';
const urlKakashi = 'https://api.pedbox.co:8590/';
const urlCalidosos = 'https://loscalidosos.com/';

const options = (method, body) => { 
  var opt = {method: method, headers: {'Content-Type': 'application/json'}}; 
  if (method == 'post' || method == 'put' || method == 'delete') opt['body'] = JSON.stringify(body);
  return opt;
}

service.login = async(body) => {
  const url = urlKakashi+'validater_user'; 
  return await makeRequest(url, options('post', body));
}

service.loginCompany = async(id_company) => {
  const url = urlKakashi+"get_background?"+id_company;
  const data =  await makeRequest(url);
  return data;
}

// *** B2B
service.calidosos = async(body) => {
  const url = urlCalidosos+'historial-puntos';
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.historialTransacciones = async(id_company, nit) => {
  const url = urlPedbox+'historial-transacciones?id_company='+id_company+'&nit='+nit;
  const data =  await makeRequest(url);
  return data;
}

service.historialFacturas = async(url_company, nit, id_company) => {
  const url = urlKakashi+'get_extranet?nit='+nit+'&tipo=4&url='+url_company+'&id_company='+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.faturaUR = async(id_factura) => {
  const url = "http://181.49.236.254:5067/wspedbox/wsgenesis.asmx?op=detalle_extranet"
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml' },
    body: `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <detalle_extranet xmlns="http://navacom.com.co/">
            <pnumero>${id_factura}</pnumero>
            <ptipo_doc>FE</ptipo_doc>
            <ptipo>20</ptipo>
          </detalle_extranet>
        </soap:Body>
      </soap:Envelope>
    `,
  }
  const data =  await makeRequestXML(url, options);
  return data;
}

service.historialRecibos = async(url_company, nit, id_company) => {
  const url = urlKakashi+'get_extranet?nit='+nit+'&tipo=5&url='+url_company+'&id_company='+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.historialNotas = async(url_company, nit, id_company) => {
  const url = urlKakashi+'get_extranet?nit='+nit+'&tipo=6&url='+url_company+'&id_company='+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.historialPedidos = async(url_company, nit, id_company) => {
  const url = urlKakashi+'get_extranet?nit='+nit+'&tipo=2&url='+url_company+'&id_company='+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.detallePedido = async(url_company, num_pedido) => {
  const url = urlPedbox1+'get_detalle_extranet?numero='+num_pedido+'&tipo_doc=0&tipo=2&url='+url_company;
  const data =  await makeRequest(url);
  return data;
}

service.detalleProductos = async(id_company, codigo) => {
  const url = urlKakashi+'get_items?id_company='+id_company+'&params='+codigo;
  const data =  await makeRequest(url);
  return data;
}

service.productosLimit = async(id_company) => {
  const url = urlKakashi+'get_items?id_company='+id_company+'&limit=100'
  const data =  await makeRequest(url);
  return data;
}

service.productosFilter = async(id_company, word) => {
  const url = urlKakashi+'get_items?id_company='+id_company+'&limit=100&params='+word;
  const data =  await makeRequest(url);
  return data;
}

service.productosById = async(id) => {
  const url = urlKakashi+'get_items?id='+id;
  const data =  await makeRequest(url);
  return data;
}

service.productosUpdate = async(body) =>{
  const url = urlKakashi+'items';
  const data =  await makeRequest(url, options('put', body));
  return data;
}

service.catalogImagesAttachment = async(string) =>{
  const url = urlServicePedbox4+'catalog/getImagesAttachment/'+string;
  const data =  await makeRequest(url);
  return data;
}

service.catalogItemsByCodeColor = async(code, codeColor) =>{
  const url = urlServicePedbox4+'catalog/getItemByCodeColor/'+code+'/'+codeColor;
  const data =  await makeRequest(url);
  return data;
}

service.productos = async(url_company, nit, id_company) => {
  const extranet = (id_company == 39 ? 12 : 10) // El catalogo de "universal de respuestos" es consultado en un extranet diferente
  const url = urlKakashi+'get_extranet?nit='+nit+'&tipo='+extranet+'&url='+url_company+'&id_company='+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.catalogColors = async(id_company) => {
  const url = urlServicePedbox4+'catalog/colors/'+ id_company
  const data =  await makeRequest(url);
  return data;
}

service.getCatalogGyW = async() => {
  const url = urlServicePedbox4+'catalog/GyW/prueba'
  const data =  await makeRequest(url);
  return data;
}

service.getCatalogDetailGyW = async(id_company, code_product) => {
  const url = urlServicePedbox4+'catalog/detail/'+id_company+'/'+code_product
  const data =  await makeRequest(url);
  return data;
}

service.topProductos = async(url_company, nit, id_company) => {
  const url = urlKakashi+'get_extranet?nit='+nit+'&tipo=34&url='+url_company+'&id_company='+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.imagenesProductos = async(id_company) => {
  const url = urlKakashi+"get_items_image?id_company="+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.imagenesProductosServicePB4 = async(id_company) => { // TODO
  const url = urlServicePedbox4+"catalog/images/"+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.catalogAttachments = async(id_company) => { // TODO
  const url = urlServicePedbox4+"catalog/attachments/"+id_company
  const data =  await makeRequest(url);
  return data;
}

service.getCodesCatalog = async(id_company) => { // TODO
  const url = urlServicePedbox4+"catalog/codes/"+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.getCodesSubstringCatalog = async(id_company) => { // TODO
  const url = urlServicePedbox4+"catalog/codesSubstringDesc/"+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.getCodesAssociateToAttribute = async(id_attribute) => { // TODO
  const url = urlServicePedbox4+"catalog/catalogCodesAssociateToAttribute/"+id_attribute
  const data =  await makeRequest(url);
  return data;
}

service.relateAttributesBySubstring = async(body) => { 
  const url = urlServicePedbox4+"catalog/relateAttributesBySubstring";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.deleteCodesAssociatedToAttribute = async(id_attribute, code, id_company) => { 
  const url = urlServicePedbox4+`catalog/catalogDeleteAttributesByCode/${id_attribute}/${code}/${id_company}`
  const data =  await makeRequest(url);
  return data;
}

service.deleteAttributeAssociated = async(id_attribute, id_item) => { 
  const url = urlServicePedbox4+`catalog/deleteAttributeAssociated/${id_attribute}/${id_item}`
  const data =  await makeRequest(url);
  return data;
}

service.deleteAttachmentsByIdItem = async(id_item, id_company) => { 
  const url = urlServicePedbox4+`catalog/deleteAttachmentsByIdItem/${id_company}/${id_item}`
  const data =  await makeRequest(url);
  return data;
}

service.deleteAttachmentDetailAttribute = async(id_image, id_attribute) => { 
  const url = urlServicePedbox4+`catalog/deleteAttachmentDetailAttribute/${id_image}/${id_attribute}`
  const data =  await makeRequest(url);
  return data;
}

service.getAttrItemById = async(id) => { 
  const url = urlServicePedbox4+`catalog/catalogAttributesByIdItem/${id}`
  const data =  await makeRequest(url);
  return data;
}

service.catalogRemoveImg = async(code, id_company) => { 
  const url = urlServicePedbox4+"catalog/removeImages/"+code+"/"+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.catalogAddImg = async(body) => { 
  const url = urlServicePedbox4+"catalog/uploadImgCode";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.catalogAddRelateImageArray = async(body) => { 
  const url = urlServicePedbox4+"catalog/relateImageArray";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.catalogProductsByCode = async(code, id_company) => { 
  const url = urlServicePedbox4+"catalog/getItems/substring/"+code+"/"+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.catalogItemsAtributes = async(id_company) => { 
  const url = urlKakashi+"items_attributes?id_company="+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.catalogItemsAtributesCreate = async(body) => { 
  const url = urlKakashi+"items_attributes";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.catalogItemsAtributesUpdate = async(body) => { 
  const url = urlKakashi+"items_attributes";
  const data =  await makeRequest(url, options('put', body));
  return data;
}

service.catalogItemsAtributesDetailCreate = async(body) => { 
  const url = urlKakashi+"items_attributes_detail";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.catalogItemsAtributesDetailUpdate = async(body) => { 
  const url = urlKakashi+"items_attributes_detail";
  const data =  await makeRequest(url, options('put', body));
  return data;
}

service.catalogItemsAtributesDelete = async(body) => { 
  const url = urlKakashi+"items_attributes";
  const data =  await makeRequest(url, options('delete', body));
  return data;
}

service.catalogItemsAtributesDetailDelete = async(body) => { 
  const url = urlKakashi+"items_attributes_detail";
  const data =  await makeRequest(url, options('delete', body));
  return data;
}


service.informacionVendedor = async(id_person) => {
  const url = urlKakashi+'get_info_seller?id_person='+id_person;
  const data =  await makeRequest(url);
  return data;
}

service.getRetenciones = async(id_company, id_country) =>{
  const url = urlKakashi+'retentions?id_company='+id_company+'&id_country='+id_country;
  const data =  await makeRequest(url);
  return data;
}

service.updateRetencion = async(body) =>{
  const url = urlKakashi+'retentions';
  const data =  await makeRequest(url, options('put', body));
  return data;
}

service.createRetencion = async(body) =>{
  const url = urlKakashi+'retentions';
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.getUsers = async(id_company, id_user_company) =>{
  const url = urlKakashi+'get_usersextranet?id_company='+id_company+'&id_user_company='+id_user_company;
  const data =  await makeRequest(url);
  return data;
}

service.getRoles = async(id_company, id_user_company) =>{
  const url = urlKakashi+'get_role_extranet?id_company='+id_company+'&id_user_company='+id_user_company;
  const data =  await makeRequest(url);
  return data;
}

service.updatePassword = async(body) =>{
  const url = urlKakashi+'change_password_user';
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.userUpdate = async(body) =>{
  const url = urlKakashi+'create_user_extranet';
  const data =  await makeRequest(url, options('put', body));
  return data;
}

service.sendCarritoCompras = async(body) =>{
  const url = urlPedbox1+'documentos';
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.sendCarritoFacturas = async(body) =>{
  const url = urlKakashi+'start-payment';
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.getPermisos = async(id_company, id_user_company) => {
  const url = urlKakashi+'get_permission?id_company='+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.updatePemiso = async(body) => {
  const url = urlKakashi+'update_permission';
  const data =  await makeRequest(url, options('put', body));
  return data;
}

service.createPermiso = async(body) => {
  const url = urlKakashi+'create_role_permission';
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.getDocumentos = async(id_company) => {
  const url = urlServicePedbox4+'documentos/'+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.getMastersDocumentos = async() => {
  const url = urlServicePedbox4+'documentos/masters';
  const data =  await makeRequest(url);
  return data;
}

service.uploadDocumentoUsuario = async(body) => {
  const url = urlServicePedbox4+'documentos/saveRegister';
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.deleteDocumentoUsuario = async(body) => {
  const url = urlServicePedbox4+'documentos/deleteRegister';
  const data =  await makeRequest(url, options('post', body));
  return data;
}

// ** Helpdesk
service.getHelpdeskIndicators = async(id_company, id_user) => {
  const url = urlKakashi+"get_helpdesk?id_company="+id_company+"&id_user="+id_user;
  const data =  await makeRequest(url);
  return data;
}

service.getHelpdeskOcurrence = async(id_company, state, helpdesk) => {
  const url = urlKakashi+"get_ocurrence_helpdesk?id_company="+id_company+"&state="+state+"&helpdesk="+helpdesk+"&offset=0&limit=20";
  const data =  await makeRequest(url);
  return data;
}

service.getMastersHelpdesk = async(id_company) => {
  const url = urlKakashi+"get_master_helpdesk?id_company="+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.getAdminFormat = async(id_company) => {
  const url = urlKakashi+"adminFormat?id_company="+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.getUsersHelpdesk = async(id_company) => {
  const url = urlKakashi+"get_user_helpdesk?id_company="+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.getDetailformat = async(id, id_node, id_workflow_header, id_workflow) => {
  const url = urlKakashi+"getDetailformat?id="+id+"&id_node="+id_node+"&id_workflow_header="+id_workflow_header+"&id_workflow="+id_workflow;
  const data =  await makeRequest(url);
  return data;
}

service.getNewDetailformat = async(id, id_node, id_workflow_header) => {
  const url = urlKakashi+"getDetailformat?id="+id+"&id_node="+id_node+"&id_workflow_header="+id_workflow_header;
  const data =  await makeRequest(url);
  return data;
}

service.getEditDetailFormat = async(id, id_header) => {
  const url = urlKakashi+"getDetailformat?id="+id+"&id_header="+id_header;
  const data =  await makeRequest(url);
  return data;
}

service.getEditDetailFormatById = async(id) => {
  const url = urlKakashi+"getDetailformat?id="+id;
  const data =  await makeRequest(url);
  return data;
}

service.getManagement = async(id_activitie) => {
  const url = urlKakashi+"management?id_activitie="+id_activitie;
  const data =  await makeRequest(url);
  return data;
}

service.getSolicitudes = async(id_company, id_user) => {
  const url = urlKakashi+"getFormatRequest?id_company="+id_company+"&id_user="+id_user
  const data =  await makeRequest(url);
  return data;
}

service.getNodes = async(id_company) => {
  const url = urlKakashi+"proc_node?id_company="+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.getDiagrams = async(id_company) => {
  const url = urlKakashi+"proc_workflow?id_company="+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.getAttendFormat = async(id_format_answer) => {
  const url = urlKakashi+"attendFormat?id_header="+id_format_answer;
  const data =  await makeRequest(url);
  return data;
}

service.postAttendFormat = async(body) => {
  const url = urlKakashi+"attendFormat";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.putAttendFormat = async(body) => {
  const url = urlKakashi+"attendFormat";
  const data =  await makeRequest(url, options('put', body));
  return data;
}

service.getWorkflow = async(id_company, id_area) => {
  const url = urlKakashi+"proc_get_workflow?id_company="+id_company+"&id_area="+id_area;
  const data =  await makeRequest(url);
  return data;
}

service.startWorkflow = async(body) => {
  const url = urlKakashi+"start_workflow";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.continueWorkflow = async(body) => {
  const url = urlKakashi+"continue_workflow";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.adminMasters = async(id_company) => {
  const url = urlKakashi+"admindMaster?id_company="+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.takeOcurrence = async(body) => {
  const url = urlKakashi+"take_occurrence";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.getPersonsCompany = async(id_company, type_person) => { 
  const url = urlKakashi+"get_personsmallcompany?id_company="+id_company+"&type_person="+type_person;
  const data =  await makeRequest(url);
  return data;
}

service.getPersonsMap = async(id_company, type_person, sellers) => { 
  const url = urlKakashi+`get_person?id_company=${id_company}&type_person=${type_person}&type_user=2,6&seller=${sellers}`;
  const data =  await makeRequest(url);
  return data;
}

service.getSellersList = async(id_company, id_user) => { 
  const url = urlKakashi+`getDateUser?id=${id_user}&type_user=U&id_company=${id_company}`;
  const data =  await makeRequest(url);
  return data;
}

service.getPersonsMapByDate = async(id_company, date, sellers) => { 
  const url = urlKakashi+`get_person?id_company=${id_company}&date=${date}&type_person=5&type_user=2,6&seller=${sellers}`;
  const data =  await makeRequest(url);
  return data;
}

service.getSellersManagment = async(id_company, dateS, dateE) => { 
  const url = urlKakashi+`getReporSellermanagement?id_empresa=${id_company}&inicio=${dateS}&fin=${dateE}&nit=0&tipo_usuario=U`;
  const data =  await makeRequest(url);
  return data;
}

service.getExportSellersLocation = async(body) => { 
  const url = urlKakashi+`exportSellerLastLocation`;
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.getSellerHistoryRecorrido = async(id_company, id_seller, dateS, dateE) => { //TODO
  const url = urlKakashi+`get_history_seller?id_company=${id_company}&id_seller=${id_seller}&date_begin=${dateS}&date_end=${dateE}`;
  const data =  await makeRequest(url);
  return data;
}

service.getSellerClients = async(id_company, id_seller) => { //TODO
  const url = urlKakashi+`get_person?id_company=${id_company}&seller=${id_seller}&type_person=3`;
  const data =  await makeRequest(url);
  return data;
}

service.getUsersCompany = async(id_company, status) => { 
  const url = urlKakashi+"get_userscompany?id_company="+id_company+"&status="+status;
  const data =  await makeRequest(url);
  return data;
}

// Agenda
service.agendaGetDateUser = async(id_user, date_begin, date_end) => { 
  const url = urlKakashi+"get_date_user?id_user="+id_user+"&date_begin="+date_begin+"&date_end="+date_end;
  const data =  await makeRequest(url);
  return data;
}

service.agendaCumplea??os = async(id_company) => { 
  const url = urlServicePedbox4+"birthdays/"+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.currentBirthdays = async(id_company) => { 
  const url = urlServicePedbox4+"currentBirthdays/"+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.agendaCreateEvent = async(body) => {
  const url = urlKakashi+"create_quote";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.agendaUpdateEvent = async(body) => {
  const url = urlKakashi+"create_quote";
  const data =  await makeRequest(url, options('put', body));
  return data;
}

service.agendaReportSeller = async(id_company, dateS, dateE) => {
  const url = urlKakashi+"sellersCalendarCrmReport?id_company="+id_company+"&date_begin="+dateS+"&date_end="+dateE;
  const data =  await makeRequest(url);
  return data;
}

service.agendaCreateEventRepeat = async(body) => {
  const url = urlKakashi+"create_quote_repeat";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.agendaDeleteEvent = async(body) => {
  const url = urlKakashi+"delete_quote";
  const data =  await makeRequest(url, options('delete', body));
  return data;
}

service.agendaGetEventsNotifications = async(id_user) => {
  const url = urlServicePedbox4+"getNotificationsCalendar/"+id_user;
  const data =  await makeRequest(url);
  return data;
}

service.agendaChangeEventState = async(body) => {
  const url = urlKakashi+"change_state_quote";
  const data =  await makeRequest(url, options('put', body));
  return data;
}

// Notifications
service.createNotification = async(body) => { 
  const url = urlServicePedbox4+"notifications/createNotification";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.getNotification = async(id_user) => { 
  const url = urlServicePedbox4+"notifications/"+id_user;
  const data =  await makeRequest(url);
  return data;
}

service.removeNotificationByKind = async(id_user, kind) => { 
  const url = urlServicePedbox4+"removeNotificationByKind/"+id_user+"/"+kind;
  const data =  await makeRequest(url);
  return data;
}

// ** CRM
service.getMastersCrm = async(id_company) => { 
  const url = urlKakashi+"get_master_crm?id_company="+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.getDataCrm = async(idUser, typeUser, idCompany, dateS, dateE) => { 
  const url = urlKakashi+"getDateUser?id="+idUser+"&type_user="+typeUser+"&id_company=" +idCompany+"&date_begin="+dateS+"&date_end="+dateE+"&crm=1"
  const data =  await makeRequest(url);
  return data;
}

service.exportDataCrm = async(idUser, typeUser, idCompany, dateS, dateE) => { 
  const url = urlKakashi+`getDateUser?export=true&id=${idUser}&type_user=${typeUser}&id_company=${idCompany}&date_begin=${dateS}&date_end=${dateE}&crm=1`
  console.log(url)
  const data =  await makeRequest(url);
  return data;
}

service.getSellersReportsCrm = async(id_company, dateS, dateE) => { 
  const url = urlKakashi+"sellersCalendarCrmReport?id_company="+id_company+"&date_begin="+dateS+"&date_end="+dateE
  const data =  await makeRequest(url);
  return data;
}

service.getCrmDetailMonitoring = async(id_company, dateS, dateE, persons) => { 
  const url = urlKakashi+`get_count_monitoring?id_company=${id_company}&date_begin=${dateS}&date_end=${dateE}&id_person=${persons}`;
  const data =  await makeRequest(url);
  return data;
}

service.getCrmActivityMonitoring = async(id_activity, id_company, dateS, dateE, persons) => { 
  const url = urlKakashi+`get_activity_monitoring?id_company=${id_company}&id_activity=${id_activity}&date_begin=${dateS}&date_end=${dateE}&id_person=${persons}`;
  const data =  await makeRequest(url);
  return data;
}

service.getCrmDetailCartera = async(url_client, seller) => { 
  const url = urlKakashi+`get_purse_seller?url_client=${url_client}?wsdl&vendedor=${seller}&export=false`;
  const data =  await makeRequest(url);
  return data;
}

service.getCrmDetailCarteraExport = async(url_client, seller, logoUrl) => { 
  const url = urlKakashi+`get_purse_seller?url_client=${url_client}?wsdl&vendedor=${seller}&export=true&type=xls&hideNit=false&url_logo=${logoUrl}`;
  const data =  await makeRequest(url);
  return data;
}

service.createCrmMaster = async(body) => { 
  const url = urlKakashi+"setup_master";
  const data =  await makeRequest(url, options('post', body));
  return data;
}

service.updateCrmMaster = async(body) => { 
  const url = urlKakashi+"setup_master";
  const data =  await makeRequest(url, options('put', body));
  return data;
}

service.deleteCrmMaster = async(body) => { 
  const url = urlKakashi+"setup_master";
  const data =  await makeRequest(url, options('delete', body));
  return data;
}

service.getQuoteReportCrm = async(id_company, dateS, dateE) => { 
  const url = urlKakashi+"get_datereport_quotecrm?export=false&id_company="+id_company+"&date_begin="+dateS+"&date_end="+dateE
  const data =  await makeRequest(url);
  return data;
}

// ** Dashboard
service.dashboardReport = async(id_company, dateS, dateE, user) => { 
  const url = urlPedbox1+"dashboardreport2?id_company="+id_company+"&date_begin="+dateS+"&date_end="+dateE+"&user="+user;
  const data =  await makeRequest(url);
  return data;
}

service.dashboardReportSeller = async(id_company, dateS, dateE, type, seller) => { 
  const url = urlPedbox1+"dashboardreportdetail2?id_company="+id_company+"&date_begin="+dateS+"&date_end="+dateE+"&type="+type+"&seller="+seller;
  const data =  await makeRequest(url);
  return data;
}

service.dashboardReportProducts = async(id_company, dateS, dateE, seller) => { 
  const url = urlPedbox1+"dashboardinformeproductos2?id_company="+id_company+"&date_begin="+dateS+"&date_end="+dateE+"&user="+seller;
  const data =  await makeRequest(url);
  return data;
}

service.dashboardOrderDetail = async(id_company, pedido, tipo) => { 
  const url = urlPedbox1+"dashboardorderdetail?id_empresa="+id_company+"&pedido="+pedido+"&tipo="+tipo;
  const data =  await makeRequest(url);
  return data;
}

// ** Terceros
service.thirdsClients = async(id_company, type_person) => { 
  const url = urlKakashi+`get_person?id_company=${id_company}&limit=100&type_person=${type_person}&seller=0`;
  const data =  await makeRequest(url);
  return data;
}

service.thirdsMasters = async(id_company) => { 
  const url = urlKakashi+`get_master_contact?id_company=`+id_company;
  const data =  await makeRequest(url);
  return data;
}


const makeRequest = async (url, options) => {
  try {
      var resp = await fetch(url, options || {});
      if (!resp.ok) return {'err': 'Error obteniendo los datos'};
      const json = await resp.json();
      return {'result': json};
  } catch(error) {
      showLog('REQUEST URL: '+url, error);
      return {'err': 'Error obteniendo los datos', 'err_service': error};
  }
}

const makeRequestXML = async (url, options) => {
  try {
      var resp = await fetch(url, options || {});
      let xml = await resp.text();
      const json = xml_json.xml2json(xml, {compact: false, spaces: 2, trim: true})
      return {'result': JSON.parse(json)};
  } catch(error) {
      showLog('REQUEST URL: '+url, error);
      return {'err': 'Error obteniendo los datos', 'err_service': error};
  }
}

module.exports = service