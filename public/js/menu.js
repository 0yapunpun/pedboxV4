// *** Menu and header functions
// Escondear imagen usuario cuando el menu esta collapsado
const menuState = function () { 
  if ($("body").hasClass("g-sidenav-hidden")) {
    $("#imgUserMenu").hide();
  } else {
    $("#imgUserMenu").show();
  }
}

// Events
$(".sidenav-toggler").on("click", function () {
  menuState()
})

$(document).on('mouseover', '#sidebarMenu', function() {
  if ($("body").hasClass("g-sidenav-hidden")) {
    $("#imgUserMenu").show();
  }
});

$(document).on('mouseout', '#sidebarMenu', function() {
  if ($("body").hasClass("g-sidenav-hidden")) {
    $("#imgUserMenu").hide();
  }
});

const setCartIconAmount = () => {
  try {
    if (!(localStorage.getItem(cartInvoiceName) === null)) {
      let localObjectLenght = JSON.parse(localStorage.getItem(cartInvoiceName)).length;
      $("#invoicesIndicator").text((localObjectLenght ? localObjectLenght : ""))
    } 
    if (!(localStorage.getItem(cartName) === null)) {
      let localObjectLenght = JSON.parse(localStorage.getItem(cartName)).length;
      $("#cartIndicator").text((localObjectLenght ? localObjectLenght : ""))
    }  
  } catch (error) {
    // Esta vista no tiene boton de carrito    
  }
}

// Sidebar 
const showSidebar = function (x) {
  let state = $("#sidebarPage").attr("sidebarState");
  if (state == "closed") {
    $("#sidebarPage" ).css('right', 0); 
    $("#sidebarPage" ).show("slide", { direction: "right" }, 300);
    setTimeout(() => {
      $("#sidebarPage").attr("sidebarState", "open");
    }, 500);
  }
  if (state == "open") {
    $("#sidebarPage" ).hide("slide", { direction: "right" }, 300);
    setTimeout(() => {
      $("#sidebarPage").attr("sidebarState", "closed");
    }, 500);
  }
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


$(document).ready(function () {
  // Foto de perfil
  let fotoPerfil = (session.user.photo ? "https://api.pedbox.co:8590" + session.user.photo : session.user.url_logo_perfil ? session.user.url_logo_perfil : session.user.dataCompany[0].logo)
  $("#imgMenuUser").attr("src", fotoPerfil);
  $("#imgNavUser").attr("src", fotoPerfil);

  // Ocultar/Mostrar cartera
  if (!(localStorage.getItem("carteraIsVisible") === null)) {
    let carteraIsVisible = JSON.parse(localStorage.getItem("carteraIsVisible"));
    if (!carteraIsVisible) {
      $("#cards").hide();
    } 
  };
  
  // Carts indicators
  setCartIconAmount();
})
