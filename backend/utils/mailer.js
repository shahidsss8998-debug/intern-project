// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER || 'your.email@gmail.com',
        pass: process.env.SMTP_PASS || 'yourpassword'
    }
});

function sendReservationVerification(to, subject, html) {
    const mailOptions = {
        from: process.env.SMTP_USER || 'your.email@gmail.com',
        to,
        subject,
        html
    };
    return transporter.sendMail(mailOptions);
}

module.exports = { sendReservationVerification };
