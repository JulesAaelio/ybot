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
                link: `${process.env.hostname}/activate?token=${token}`,
                image: process.env.hostname + '/images/logo.png'
            }
        )
    })
}

module.exports = (bot, app, db) => {
    bot.on('message', async (message) => {
        if (message.channel.id === process.env.newcomers_channel_id && message.author.id !== bot.user.id) {
            if (mailRegexp.test(message.content)) {

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
                            email: message.content,
                        })
                    } else {
                        await db.Validation.create({
                            userId: message.author.id,
                            guildId: message.guild.id,
                            email: message.content,
                        })
                    }
                    const token = jwt.sign({
                        userId: message.author.id,
                        guildId: message.guild.id,
                        email: message.content,
                    }, process.env.jwt_secret);

                    await sendConfirmationEmail(message.content, message.author.username, token);
                }


                message.reply('A confirmation email has been sent');
            } else {
                message.reply('please provide a valid academic address');
            }
        }
    })
};