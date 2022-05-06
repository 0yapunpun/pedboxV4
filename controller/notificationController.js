const controller = {};
const service = require('../engine/apiService.js');
const { io } = require("socket.io-client");
const moment = require('moment');
const cron = require('node-cron');

let socket;
let succesSocket = false;
let user;

// Tareas programaticas
cron.schedule('* * * * *', () => { // Cada minuto
  // console.log("each minute", moment().format('hh:mm'))
  controller.birthdaysByCompany();
  controller.checkCalendarNotification(moment().format('hh:mm'));
});

cron.schedule('*/5 * * * *', () => { // Cada cinco minuto
  // console.log("each 5 minutes", moment())
  // controller.checkCalendarNotification(moment().format('hh:mm'));
});

cron.schedule('0 0 */1 * * *', async () => { // Cada hora horas
  // console.log("each hour", moment())
  // controller.birthdaysByCompany();
});

controller.subscribeSocket = async(userData) => {
  user = userData;
  socket = io.connect('https://chat.pedbox.co:3333');
  socket.on('connect', (evt) => {
    // console.log("socket notification connected")
    succesSocket = true;
    socket.emit('login', {'usuario': user.user, 'empresa': user.id_company})
  });
}

controller.createNotification = async(req, res, next) => {
  if (!succesSocket) {return res.send({success: false, error: "Notifications Conection Failed"})}

  let response = await service.createNotification(req.body);
  res.send(response);
}

controller.sendNotification = async(notification) => {
  let notification_data = {
    "alias": "sberrio",
    "img": "/files/profile/cropsantiago_profilepuoNvRe.jpg", //TODO
    "emisor": user.id, 
    "receptor": user.id, 
    "leido_por": [], 
    "recibido_por": [], 
    "empresa": "" + user.id_company, // Important send the id comapny as string
    "unread": {},
    "creado_en": moment().format("DD-MM-YYYY, HH:mm:ss"),
    "contenido": { 
      "notificationData": notification,
      "texto": "", 
      "tipo": "text", 
      "url": [] 
    }, 
    "tipo_receptor": "usuario", 
    "estado": {},
  };

  socket.emit('new_message', notification_data, (result) => {});
}

controller.getNotification = async(req, res, next) => {
  if (!succesSocket) {return res.send({success: false, error: "Notifications Conection Failed"})}

  let response = await service.getNotification(req.params.id_user);
  res.send(response.result);
}

controller.removeNotificationByKind = async(req, res, next) => {
  if (!succesSocket) {return res.send({success: false, error: "Notifications Conection Failed"})}

  let response = await service.removeNotificationByKind(req.params.id_user, req.params.kind);
  res.send(response.result);
}

controller.birthdaysByCompany = async() => {
  if (!succesSocket) return
  
  const currentBirthdays = await service.currentBirthdays(user.id_company);

  if (currentBirthdays.result.length != 0) {
    console.log("if not coming here why fire a notificcation xD")
    controller.sendNotification({kind: "birthday", data: currentBirthdays.result})
  }
}

controller.checkCalendarNotification = async(currentHour) => {
  if (!succesSocket) return 

  const currentEvents = await service.agendaGetEventsNotifications(user.id);

  if (currentEvents.result) {
    let events = currentEvents.result;
    for (let i = 0; i < events.length; i++) {
      let notificateMinutesBefore = Number(events[i].notification.split("-")[0]);
      let notificateAt = moment("1111-11-11T"+ events[i].hour_begin.slice(0, 5)).subtract(notificateMinutesBefore, 'minutes').format("hh:mm") // la hora es formateada con una fecha para poder usar la funcionalidad subtract de moment
      
      if (notificateAt == currentHour) {
        controller.sendNotification({kind: "calendar", data: events[i]})
      }

    }
    
  }
} 


module.exports = controller