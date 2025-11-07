const nodemailer = require("nodemailer");
require('dotenv').config()
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = (options) => {
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    ...options,
  });
};

module.exports = { sendMail };
