var  hbs = require('nodemailer-express-handlebars'),
  email = process.env.EMAIL_ID,
  pass = process.env.EMAIL_PWD,
  nodemailer = require('nodemailer');
const path = require('path');

var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});

var handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve('./template/api/templates/'),
  extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

module.exports = smtpTransport;