const fetch = require('node-fetch');
const { showLog } = require('./helpers');
const service = {};
const urlPedbox = 'http://api.pedbox.co:5037/';
const urlPedbox1 = 'https://pedbox.co:8531/';
const urlKakashi = 'https://api.pedbox.co:8590/';
const urlCalidosos = 'https://loscalidosos.com/';

const options = (method, body) => { 
  var opt = {method: method, headers: {'Content-Type': 'application/json'}}; 
  if (method == 'post' || method == 'put') opt['body'] = JSON.stringify(body);
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
  console.log(url)
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

service.adminMasters = async(id_company) => {
  const url = urlKakashi+"admindMaster?id_company="+id_company;
  const data =  await makeRequest(url);
  return data;
}

service.getPersonsCompany = async(id_company, type_person) => { //TODO para sacar las personas a las que le va a lelgar la notificación
  const url = urlKakashi+"get_personsmallcompanyid_company="+id_company+"&type_person="+type_person;
  const data =  await makeRequest(url);
  return data;
}

// validateRequestTaken // TODO donde se aplica estavilación
// get_userscompany

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