const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const nvFormatCash = (text) => {
  let pre = "";
  let decimal = 2;
  let entero = 3;
  let sepDecimal = '.';
  let sepEntero = ',';

  if(typeof(text) == 'string') {
    text = parseFloat(text);
  }
  let regex = '\\d(?=(\\d{' + (entero || 3) + '})+' + (decimal > 0 ? '\\D' : '$') + ')';
  let number = text.toFixed(Math.max(0, ~~decimal));
  let space = (pre != "")? " ": "";
  return "$ "+pre + space + (sepDecimal ? number.replace('.', sepDecimal) : number).replace(new RegExp(regex, 'g'), '$&' + (sepEntero || ','));
};

const nvFormatDate = (text, format) => {
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

// Armado para envio de pedidos
const addCharacter = (n, length, character, position) => {
  character = character || "0";
  position = position || "left";
  n = n.toString();
  while(n.length < length){
    if(position != "left"){
      n =  n + character;
    }else{
      n = character + n;
    }
  }
  return n;
}

const getFileExtension = function (filename){
  var ext = /^.+\.([^.]+)$/.exec(filename);
  return ext == null ? "" : ext[1];
}

// Formatear JSON invalidos
const handleJSON = (s) => {
  if (s == null && s == "") { return }
  // Remove special characters
  s = s.replace(/\\n/g, "\\n")  
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f")
        .replace(/\r\n/g, "''")
        .replace(/\r/g, "' '")
        .replace(/[\u{0080}-\u{FFFF}]/gu,"");
        
  return JSON.parse(s)
}

const getCurrentDate = ()  => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return dd + '/' + mm + '/' + yyyy;
}

const randomIndetifier = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

// Format dates
Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});