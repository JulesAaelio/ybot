const nodemailer = require('nodemailer');
const pug = require('pug');
const transporter = nodemailer.createTransport({
    host: process.env.smtp_host,
    port: 465,
    auth : {
        user: process.env.smtp_user,
        pass: process.env.smtp_password,
    }
});

async function sendConfirmationEmail(to, link) {
    return transporter.sendMail({
        from: "YBot - Discord Ynov Lyon - <discord-ynov-lyon@outlook.com>",
        to: to,
        subject: 'Confirme ton adresse mail ! ',
        html : pug.renderFile('src/templates/mail.pug',  {
                pseudo: 'Jules',
                link: link,
                image: process.env.hostname + '/images/logo.png'
            }
        )
    })
}

module.exports = sendConfirmationEmail;