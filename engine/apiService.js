const fetch = require('node-fetch');
const { showLog } = require('./helpers');
const service = {};
const urlPedbox = 'http://api.pedbox.co:5037/';
const urlPedbox1 = 'https://pedbox.co:8531/';
const urlKakashi = 'https://api.pedbox.co:8590/';
const urlCalidosos = 'https://loscalidosos.com/';

const options = (method, body) => { 
  var opt = {method: method, headers: {'Content-Type': 'application/json'}}; 
  if (method == 'post') opt['body'] = JSON.stringify(body);
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

service.repetirPedido = async(id_company, codigo) => {
  const url = urlKakashi+'get_items?id_company='+id_company+'&params='+codigo;
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