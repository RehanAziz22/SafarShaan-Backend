const userModel = require("../model/userSchema.js");
const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  // connect with the smtp
  let transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: 'sebastian.collins45@ethereal.email',
        pass: 'AYYN11tgFsRJ9AvG21'
    },
  });

  let info = await transporter.sendMail({
    from: '"Vinod Thapa 👻" <thapa@gmail.com>', // sender address
    to: "iam@gmail.com", // list of receivers
    subject: "Hello Thapa", // Subject line
    text: "Hello YT Thapa", // plain text body
    html: "<b>Hello YT Thapa</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  res.json(info);
};

module.exports = sendMail;