import nodemailer from 'nodemailer';

const sendMail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  let isSent = false;
  try {
    const response = await transporter.sendMail(mailOptions);
    if (response.accepted.length > 0) {
      isSent = true;
    }
  } catch (error) {
    console.log(error);
  }

  return isSent;
};

export default sendMail;
