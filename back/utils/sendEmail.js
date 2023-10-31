const nodemailer = require("nodemailer");

module.exports = async (userEmail, subject, htmlTemplate) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'letha.boyle67@ethereal.email',
          pass: '7W3sf68Dwgv8nUqQJV'
      }
  });

    const mailOptions = {
      from: 'letha.boyle67@ethereal.email',
      to: userEmail,
      subject: subject,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent: " + info.response);
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error (nodemailer)");
  }
};