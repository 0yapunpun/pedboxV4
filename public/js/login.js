const server = 'https://api.pedbox.co:8590/';
const urlSocket = localStorage.getItem('urlSocket');
const nameSpace = localStorage.getItem('namespace');
var loginActive = false;
let ipAddress;

if(!_.isNull(nameSpace) && !_.isNull(urlSocket)) {
  window.location.href = 'chat.html';
}

$('#user').on('keypress',function(e) {
  if(e.which == 13) {
    $('#pass').focus();
  }
});

$('#pass').on('keypress',function(e) {
  if(e.which == 13) {
    login();
  }
});

const login = () => {
  $.getJSON("https://api.ipify.org/?format=json", (resultIpify) => {ipAddress = resultIpify.ip});
  const user = $('#user').val();
  const pass = $('#pass').val();

  if (!loginActive) {
    if(user && pass) {
      loginActive = true;
      $('#btn-loading').fadeIn();
      $('#btn-f').hide();

      $.ajax({
        type: 'POST',
        data: {"user": user, "password": pass, "ipAddress": ipAddress, "remember": undefined},
        error: (request, status, error) => {
          showError();
          $('#btn-loading').hide();
          $('#btn-f').show();
          loginActive = false;
        }
      }).done((result) => {
        if (result.err) {
          showError();
          $('#btn-loading').hide();
          $('#btn-f').show();
          loginActive = false;
        } else if(result.result == 'ok') {
          window.location.href = '/catalogo';
        }
      })
    } else {
      showError()
    }
  }
}

const showError = () => {
  $('#msg-err').fadeIn('fast', () => {
    setTimeout(() => {
      $('#msg-err').fadeOut('slow')
    }, 1500);
  })
}