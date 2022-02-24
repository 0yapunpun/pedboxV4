// *** Menu and header functions
// Controlar color del menu
const loadColorsBrand = function (data) {
  $(".menuHeader").css("background-color", data.color1);
  $(".menuBody").css("background-color", data.color2);
  $(".menuBody").find("h6").attr("style", "color:" + data.color4);
  $(".menuBody").find(".nav-link-text").attr("style", "color:" + data.color4);
  $(".menuBody").find(".activeNav ").find(".icon-shape").attr("style", "background-color:"+data.color3+" !important; background-image:none");
  $(".menuBody .activeNav a").css("background-color", "transparent");

  $("#imgMenuHeadSmall")
  $("#imgMenuHead")
  $("#imgMenuUser")
  $("#menuUserName")
  $("#menuCompanyName")
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

$(document).ready(function () {
  // Ocultar/Mostrar cartera
  if (!(localStorage.getItem("carteraIsVisible") === null)) {
    let carteraIsVisible = JSON.parse(localStorage.getItem("carteraIsVisible"));
    if (!carteraIsVisible) {
      $("#cards").hide();
    } 
  };
  // Carts indicators
  if (!(localStorage.getItem("storeInvoice") === null)) {
    let localObjectLenght = JSON.parse(localStorage.getItem("storeInvoice")).length;
    $("#invoicesIndicator").text((localObjectLenght ? localObjectLenght : ""))
  } 
  if (!(localStorage.getItem("storeCart") === null)) {
    let localObjectLenght = JSON.parse(localStorage.getItem("storeCart")).length;
    $("#cartIndicator").text((localObjectLenght ? localObjectLenght : ""))
  }  
})



// TODO: como llamar la funcion desde aca, y con el obj session
// OBJ session
let objSession = {
  "success": true,
  "message": "",
  "error": "",
  "url_socket": "https://chat.pedbox.co:6306",
  "user": [
      {
          "id": 219,
          "user": "tecnodiesel",
          "nit_client": "",
          "id_type_user": 1,
          "type_user": "U",
          "id_role": 29,
          "id_company": 22,
          "company": "TECNODIESEL",
          "code": "22",
          "url_client": "181.48.218.242/wsgenesis/wsgenesis.asmx",
          "url_pedbox": "http://api.pedbox.co:4590/",
          "url_reports": "http://181.48.218.242:5000",
          "url_logo": "http://api.pedbox.co/images/Tecnodiesel.png",
          "url_logo_perfil": "",
          "seller": "",
          "warehouse": "0",
          "list_price": 0,
          "id_country": 1,
          "change_password": 0,
          "photo": "/files/profile/cropTecnodiesel_profileDc0wFzf.png",
          "name": "Administrador",
          "nit": "22",
          "id_person": 219,
          "id_subgroup": 122,
          "email": "f.morales@tecnodiesel.com.co",
          "email_alert": "soporte@navacom.com.co",
          "permission": [
              {
                  "id": 01,
                  "code": "6000_CAN_ACCESS_CRM",
                  "content": "S"
              },
              {
                  "id": 02,
                  "code": "6005_CAN_VIEW_ATIVITY_CRM",
                  "content": "S"
              },
              {
                  "id": 03,
                  "code": "6010_CAN_VIEW_PORTFOLIO_CRM",
                  "content": "S"
              },
              {
                  "id": 03,
                  "code": "6015_CAN_VIEW_EMPLOYEES_CRM",
                  "content": "S"
              },
              {
                  "id": 05,
                  "code": "6020_CAN_CREATE_ACTIVITY_CRM",
                  "content": "S"
              },
              {
                  "id": 06,
                  "code": "6025_CAN_EDIT_ACTIVITY_CRM",
                  "content": "S"
              },
              {
                  "id": 07,
                  "code": "6030_CAN_DELETE_ACTIVITY_CRM",
                  "content": "S"
              },
              {
                  "id": 08,
                  "code": "6035_CAN_VIEW_MASTER_CRM",
                  "content": "S"
              },
              {
                  "id": 09,
                  "code": "6040_CAN_CREATE_MASTER_CRM",
                  "content": "S"
              },
              {
                  "id": 10,
                  "code": "6045_CAN_EDIT_MASTER_CRM",
                  "content": "S"
              },
              {
                  "id": 11,
                  "code": "6050_CAN_DELETE_MASTER_CRM",
                  "content": "S"
              },
              {
                  "id": 11,
                  "code": "6060_HIDE_NIT_IN_PDF_PORTFOLIO",
                  "content": "S"
              },
              {
                  "id": 09,
                  "code": "6065_CAN_DOWNLOAD_PORTFOLIO_QUOTAS",
                  "content": "S"
              }
          ],
          "methodsSync": [],
          "dataCompany": [
              {
                  "nit": "22",
                  "nombre": "TECNODIESEL",
                  "Url": "181.48.218.242/wsgenesis/wsgenesis.asmx",
                  "Tipo_url": "XML ",
                  "direccion": "",
                  "telefono": "",
                  "ciudad": "MEDELLIN",
                  "departamento": "ANTIOQUIA",
                  "pais": "Colombia",
                  "id": 22,
                  "url_pedbox": "http://ventadirecta.co/genesis4/wsdata.asmx",
                  "url_server": "http://api.pedbox.co:4590/",
                  "logo": "http://api.pedbox.co/images/Tecnodiesel.png",
                  "url_factura": "",
                  "descripcion_mail": "Tecnodiesel",
                  "host": "smtp.gmail.com",
                  "puerto": 587,
                  "usuario": "pedboxmobile@gmail.com",
                  "clave": "PEDBOX20121111",
                  "aut_ssl": 1,
                  "url_json": "NO",
                  "colors": {
                    "color1": "#feff00",
                    "color2": "#004175",
                    "color3": "#031f66",
                    "color4": "#fff"
                  }
              }
          ],
          "query_database": "",
          "extranet": null,
          "address": ""
      }
  ],
  "token": ""
}

loadColorsBrand(objSession.user[0].dataCompany[0].colors);
