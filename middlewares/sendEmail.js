const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const {SENDGRID_API_KAY} = process.env;


sgMail.setApiKey(SENDGRID_API_KAY);


const sendEmail = async (data) => {

const email = {...data, from: "eduardxarlan@gmail.com"}
await sgMail.send(email);
  return true;
}

module.exports = sendEmail;