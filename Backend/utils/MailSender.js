const nodemailer = require("nodemailer");
require("dotenv").config();
// mail sender apply here
const MailSender = async (email, title, body) => {
  try {
    // cerate the single connection here first so we gets
    let transporte = nodemailer.createTransport({
      host: process.env.HOST_NAME,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // MESSAGAE TRANSPORT
    let message = await transporte.sendMail({
      from: `learnify || codenotion -by edtech`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log("", message);
    return message;
    // error response apply here
  } catch (er) {
    console.error(er.message);
    console.log("nodemailer error!");
  }
};

module.exports = MailSender;
