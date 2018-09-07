const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.smtp_host,
    port: 465,
    auth : {
        user: process.env.smtp_user,
        pass: process.env.smtp_password,
    }
});

async function sendConfirmationEmail() {
    return transporter.sendMail({
        from: "YBot - Discord Ynov Lyon - <discord-ynov-lyon@outlook.com>",
        to: "jules.laurent@ynov.com",
        subject: 'tester',
        text : "Sample test"
    })
}

module.exports = sendConfirmationEmail;