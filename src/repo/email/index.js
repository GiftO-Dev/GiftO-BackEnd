const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  }
}));

exports.sendEmail = (to, subject, text) => {
  transporter.sendMail({
    from: 'square.jeon@gmail.com',
    to, subject, text,
  }, (error, info) => {
    if (!!error) {
      console.log(error);
      throw error;
    }

    console.log(info);
  });
};
