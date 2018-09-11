const nodemailer = require('nodemailer');
const pug = require('pug');
const mailRegexp = /^(.*)@ynov.com$/;

const transporter = nodemailer.createTransport({
    host: process.env.smtp_host,
    port: 465,
    auth : {
        user: process.env.smtp_user,
        pass: process.env.smtp_password,
    }
});

async function bla() {

}

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

module.exports = (bot, app, db) => {
  bot.on('message', (message) => {
      if(message.channel.id === process.env.newcomers_channel_id && message.author.id !== bot.user.id) {
          if(mailRegexp.test(message.content)) {

                db.Validation.create({
                    email : message.content,
                    userId: message.author.id,
                    guildId : message.guild.id,
                });
          }else {
              message.reply('please provide a valid academic address');
          }
      }
  })
};