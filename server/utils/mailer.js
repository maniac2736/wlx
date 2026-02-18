const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maniac2736@gmail.com", // replace with your actual email
      pass: "nncm ilqd mopp xktg", // your app password
    },
  });

  const mailOptions = {
    from: `Wallo SecureGate <maniac2736@gmail.com>`, // same email here
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
