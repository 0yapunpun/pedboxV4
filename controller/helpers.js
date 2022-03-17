const helpers = {};

helpers.hasPermission = (permissions, permission) => {
  let permissionIndex; 
  permissionIndex = permissions.map(e => e.code).lastIndexOf(permission);
  if (permissionIndex == -1 || permissions[permissionIndex].content == "N") {
    return false
  };
  return true
}

helpers.nvFormatCash = (
  text = 0,
  pre = "",
  decimal = 2,
  entero = 3,
  sepDecimal = '.',
  sepEntero = ','
) => {
  if(typeof(text) == 'string') {
      text = parseFloat(text);
  }
  let regex = '\\d(?=(\\d{' + (entero || 3) + '})+' + (decimal > 0 ? '\\D' : '$') + ')';
  let number = text.toFixed(Math.max(0, ~~decimal));
  let space = (pre != "")? " ": "";
  return pre + space + (sepDecimal ? number.replace('.', sepDecimal) : number).replace(new RegExp(regex, 'g'), '$&' + (sepEntero || ','));
}

helpers.nvFormatDate = (text, format) => {
  let textString = ""+text;
  let date = new Date(textString.replace(/([.]+[0-9]+[Z])/g, ""));
  let days = [
      'Domingo','Lunes','Martes','Miercoles',
      'Jueves','Viernes','Sabado'
  ];
  let months = [
      'Enero','Febrero','Marzo',
      'Abril','Mayo','Junio',
      'Julio','Agosto','Septiembre',
      'Octubre','Noviembre','Diciembre'
  ];
  let result;

  result = format.replace(/(mmmm)/g, months[date.getMonth()]);
  result = result.replace(/(dddd)/g, days[date.getDay()]);
  if(result.indexOf("hhhh") != -1) {
      let hourString = parseInt((date.getHours() < 10)? "0"+date.getHours(): date.getHours()+"");
      let hour = hourString % 12 || 12;
      let ampm = (hourString < 12 || hourString === 24) ? "a.m" : "p.m";
      let ampm2 = (hourString < 12 || hourString === 24) ? "AM" : "PM";

      result = result.replace(/(hhhh)/g, ((hour < 10)? "0"+hour: hour));
      result = result.replace(/(ampm)/g, ampm);
      result = result.replace(/(AMPM)/g, ampm2);
  }else {
      result = result.replace(/(HH)/g, ((date.getHours() < 10)? "0"+date.getHours(): date.getHours()+""));
  }
  result = result.replace(/(mm)/g, ((date.getMinutes() < 10)? "0"+date.getMinutes(): date.getMinutes()+""));
  result = result.replace(/(ss)/g, ((date.getSeconds() < 10)? "0"+date.getSeconds(): date.getSeconds()+""));
  result = result.replace(/(MM)/g, ((date.getMonth()+1 < 10)? "0"+(date.getMonth()+1): (date.getMonth()+1)+""));
  result = result.replace(/(DD)/g, ((date.getDate() < 10)? "0"+date.getDate(): date.getDate()+""));
  result = result.replace(/(YYYY)/g, date.getFullYear()+"");
  return result;
}

helpers.nvCapitalize = (text) => {
  text = text.toLowerCase();
  return text.replace(/\b\w/g, l => l.toUpperCase());
}

module.exports = helpers;