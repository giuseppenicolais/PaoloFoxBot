var mailer = function(){

    'use strict';
    const nodemailer = require('nodemailer'),
          config = require('../config/index');

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        // host: 'smtp.gmail.email',
        // port: 587,
        // secure: false, // true for 465, false for other ports
        service: 'Gmail',
        auth: {
            user: config.email.address, // generated ethereal user
            pass: config.email.password  // generated ethereal password
        }
    }),

    _sendEmail = function(options){
        // setup email data with unicode symbols
        let mailOptions = {
            from: `"PaoloFox Bot 🤖" <${config.email.address}>`, // sender address
            to: `${config.email.address}`, // list of receivers
            subject: 'PaoloFoxBot Error 😥', // Subject line
            text: options.err + ' \n ' + JSON.stringify(options.opts) // plain text body
            // html: '<b>Hello world?</b>' // html body
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    }

    return {
        sendEmail: _sendEmail
    }
}();

module.exports = mailer;