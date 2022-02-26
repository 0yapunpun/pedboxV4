const fetch = require('node-fetch');
const { sendCarritoCompras } = require('../controller/viewController');
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
  const url = urlKakashi+'get_extranet?nit='+nit+'&tipo=10&url='+url_company+'&id_company='+id_company;
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
  const data =  await makeRequest(url, options('POST', body));
  return data;
}

service.sendCarritoFacturas = async(body) =>{
  const url = urlKakashi+'start-payment';
  const data =  await makeRequest(url, options('POST', body));
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