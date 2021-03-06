const nodemailer = require('nodemailer');
const pug = require('pug');
const mailRegexp = /^(.*)@ynov.com$/;
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    host: process.env.smtp_host,
    port: 465,
    auth: {
        user: process.env.smtp_user,
        pass: process.env.smtp_password,
    }
});

async function sendConfirmationEmail(to, pseudo, token) {
    return transporter.sendMail({
        from: "YBot - Discord Ynov Lyon - <discord-ynov-lyon@outlook.com>",
        to: to,
        subject: 'Confirme ton adresse mail ! ',
        html: pug.renderFile('src/templates/mail.pug', {
                pseudo: pseudo,
                link: `${process.env.hostname}/validate?token=${token}`,
                image: process.env.hostname + '/images/logo.png'
            }
        )
    })
}

module.exports = (bot, app, db) => {

    return async (arguments, message) => {
            const mail = arguments[0];
            if (mail && mailRegexp.test(mail)) {
                const validation = await db.Validation.findOne({
                    where: {
                        userId: message.author.id,
                        guildId: message.guild.id,
                    }
                });

                if (validation && validation.validated) {
                    message.reply('You already validated your email');
                } else {
                    if (validation) {
                        await validation.update({
                            email: mail,
                        })
                    } else {
                        await db.Validation.create({
                            userId: message.author.id,
                            guildId: message.guild.id,
                            email: mail,
                        })
                    }
                    const token = jwt.sign({
                        userId: message.author.id,
                        guildId: message.guild.id,
                        email: mail,
                    }, process.env.jwt_secret);

                    await sendConfirmationEmail(message.content, message.author.username, token);
                    message.reply('A confirmation email has been sent. Check your spams');
                }



            } else {
                message.reply('Please provide a valid academic address');
            }
        }
};