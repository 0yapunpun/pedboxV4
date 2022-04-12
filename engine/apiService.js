const fetch = require('node-fetch');
const { showLog } = require('./helpers');
const service = {};
const urlPedbox = 'http://api.pedbox.co:5037/';
const urlServicePedbox4 = 'http://localhost:7777/'; //TODO cambiar entre real y pruebas
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
  const url = urlKakashi+'get_extranet?nit='+nit+'&tipo=1&url='+url_company+'&id_company='+id_company;
  const data =  await makeRequest(url);
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

service.productos = async(url_company, nit, id_company) => {
  const extranet = (id_company == 39 ? 12 : 10) // El catalogo de "universal de respuestos" es consultado en un extranet diferente
  const url = urlKakashi+'get_extranet?nit='+nit+'&tipo='+extranet+'&url='+url_company+'&id_company='+id_company;
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

service.informacionVendedor = async(id_person) =>{
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

service.getUsersCompany = async(id_company, Status) => { 
  const url = urlKakashi+"get_userscompany?id_company="+id_company+"&status="+Status;
  const data =  await makeRequest(url);
  return data;
}

// Agenda
service.agendaGetDateUser = async(id_user, date_begin, date_end) => { 
  const url = urlKakashi+"get_date_user?id_user="+id_user+"&date_begin="+date_begin+"&date_end="+date_end;
  const data =  await makeRequest(url);
  return data;
}

service.agendaCumpleaños = async(id_company) => { 
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


// CRM
service.getMastersCrm = async(id_company) => { 
  const url = urlKakashi+"get_master_crm?id_company="+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.getSellersReportsCrm = async(id_company, date) => { 
  const url = urlKakashi+"sellersCalendarCrmReport?id_company="+id_company+"&date_begin="+date+"&date_end="+date
  const data =  await makeRequest(url);
  return data;
}

service.getQuoteReportCrm = async(id_company) => { 
  const url = urlKakashi+"get_datereport_quotecrm?export=false&id_company="+id_company
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

module.exports = service