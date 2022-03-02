// *** Menu and header functions
// Controlar color por compañia
const loadColorsBrand = function (data) {
  let company = data.user.id_company;
  console.log(company)

  if (company == 36 || company == 5  || company == 10) {$("#colorBrand").attr("href", "/css/custom/color1.css")}
  if (company == 15) {$("#colorBrand").attr("href", "/css/custom/color2.css")}
};

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

// Esconder secciones menu
const handlePermissionsMenu = (data) => {
  let permissions = data.user.permission || data.permission;
  let permissionIndex; 

  permissionIndex = permissions.findIndex(x => x.code === "5100_CAN_ACCESS_PERMISSIONS");
  if (permissionIndex == -1 || permissions[permissionIndex].content == "N") {
    $("#menuPermisos").hide();
  };

  permissionIndex = permissions.findIndex(x => x.code === "8029_VIEW_TOP_50_PRODUCTS");
  if (permissionIndex == -1 || permissions[permissionIndex].content == "N") {
    $("#menuCatalogoTop").hide();
  };

  permissionIndex = permissions.findIndex(x => x.code === "8028_CAN_ACCESS_TO_CALIDOSOS");
  if (permissionIndex == -1 || permissions[permissionIndex].content == "N") {
    $("#menuCalidosos").hide();
  };

  permissionIndex = permissions.findIndex(x => x.code === "8010_CAN_VIEW_DOCUMENT_HISTORY_EXTRANET");
  if (permissionIndex == -1 || permissions[permissionIndex].content == "N") {
    $("#menuHistorialDocumentos").hide();
  };
};

$(document).ready(function () {
  // Foto de perfil
  let fotoPerfil = (session.user.photo ? "https://api.pedbox.co:8590" + session.user.photo : session.user.dataCompany[0].logo)
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
    console.log("This view has no cart", error)    
  }

  loadColorsBrand(session);
  handlePermissionsMenu(session);
})
