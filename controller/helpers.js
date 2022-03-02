
const helpers = {};

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

module.exports = helpers;