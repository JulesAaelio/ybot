require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', function (evt) {
    console.log('Connected');
});

require('./features/welcome-newcomers')(bot);

bot.login(process.env.discord_token)
    .catch((e) => console.log(e));