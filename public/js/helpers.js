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

const loadCartera = (data) => {
  let cupoCredito = Number(data.cupo);
  let saldoVencido = Number(data.Vr_Vencido_1_a_15) + Number(data.Vr_Vencido_16_a_30) + Number(data.Vr_Vencido_31_a_45) + Number(data.Vr_Vencido_46_a_60) + Number(data.Vr_Vencido_61_a_90) + Number(data.Vr_Vencido_91_a_120) + Number(data.Vr_Vencido_Mas_120);
  let saldoTotal = saldoVencido + Number(data.Vr_Saldo_Sin_Vencer);
  let cupoDisponible = cupoCredito - saldoVencido;
      cupoDisponible = (cupoDisponible > 0 ? cupoDisponible : 0)

  $("#containerSaldoTotal").html(numberWithCommas(saldoTotal))
  $("#containerSaldoVencido").html(numberWithCommas(saldoVencido))
  $("#containerCupoCredito").html(numberWithCommas(cupoCredito))
  $("#containerCupoDisponible").html(numberWithCommas(cupoDisponible))

  var chartCartera = document.getElementById("chart").getContext("2d");
    new Chart(chartCartera, {
    type: "doughnut",
    data: {
      labels: ['Saldo Total', 'Saldo Vencido', 'Cupo Disponible'],
      datasets: [{
        label: "Projects",
        weight: 9,
        cutout: 60,
        tension: 0.9,
        pointRadius: 2,
        borderWidth: 2,
        backgroundColor: ['#ffa726', '#ef5350', '#67bc6b'],
        data: [saldoTotal, saldoVencido, cupoDisponible], //Revisar que los valores esten bien
        fill: false
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// Ocultar/Mostrar cartera
const hideCards = () => {
  if ($("#cards").is(":visible")) {
    $("#cards").fadeOut();
    $("#toggleShowCardsIcon").html('<i class="fas fa-plus"></i> Mostrar Cartera')
    localStorage.setItem("carteraIsVisible", false);
  } else {
    $("#cards").fadeIn();
    $("#toggleShowCardsIcon").html('<i class="fas fa-minus"></i> Ocultar Cartera')
    localStorage.setItem("carteraIsVisible", true);
  }
};
