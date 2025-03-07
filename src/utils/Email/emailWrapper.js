/** @format */
import nodeMailer from 'nodemailer';
const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    secure: false, // Use `false` for STARTTLS (port 587)
    tls: {
      rejectUnauthorized: false, // Bypass SSL verification (not recommended for production)
      ciphers: 'SSLv3', // Force SSLv3 cipher
    },
  });
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
    headers: {
      'X-Priority': '1', // High priority
      'X-MSMail-Priority': 'High', // For Microsoft clients
      Importance: 'High', // To make the email look important
    },
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    console.log(error);
    console.log(error.message);
  }
};

export default sendEmail;
