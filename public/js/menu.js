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

$(document).on('click', function(e) {
  if ($("#sidebarPage").attr("sidebarState") == "open") {
    if (!(e.target.id == "sidebarPage" || $(e.target).parents("#sidebarPage").length)) {
      $("#sidebarPage").attr("sidebarState", "closed");
      $("#sidebarPage" ).hide("slide", { direction: "right" }, 300);
    }
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

const getFileExtension = function (filename){
  var ext = /^.+\.([^.]+)$/.exec(filename);
  return ext == null ? "" : ext[1];
}


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
