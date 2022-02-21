const helpers = {};
const moment = require("moment");
const nodemailer = require('nodemailer');
const { promisify } = require('util')

const typeInfo = {1: 'ERROR', 2: 'LOG'};

helpers.sendMail = async(options) => {
    let transporter = nodemailer.createTransport({
        'host': 'smtp.gmail.com',
        'port': 465,
        'secure': true,
        'auth': {
            'user': 'pedboxmobile@gmail.com',
            'pass': 'PEDBOX20121111'
        },
        'tls': {
            'rejectUnauthorized': true
        }
    });

    var mailOptions = {
        'from': 'PEDBOX <"pedboxmobile@gmail.com">',
        'to': options.to,
        'cc': options.cc || '',
        'subject': options.subject,
        'text': '',
        'html': options.html
    }

    const send = promisify(transporter.sendMail).bind(transporter);

    try {
        const result = await send(mailOptions);
        return {'result': result};
    } catch(err) {
        return {'err': err};
    }
}

helpers.showLog = (target, info, type) => {
    type = type || 1;
    console.log(`------------ ${typeInfo[type]} | ${target} -----------`);
    console.log(`${moment().format('LLL')} - ${target}: `,info);
    console.log(`------------ ${typeInfo[type]} | ${target} -----------`);
}

module.exports = helpers;