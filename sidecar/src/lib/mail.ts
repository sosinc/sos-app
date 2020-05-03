import { createTransport } from "nodemailer";

const {
  SMTP_HOST = "smtp.ethereal.email",
  SMTP_PORT = "587",
  SMTP_USER = "marcia.kirlin65@ethereal.email",
  SMTP_PASSWORD = "EN2pw6VzAZnkyzAuDb",
} = process.env;

// create reusable transporter object using the default SMTP transport
const transporter = createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT, 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export default transporter;
