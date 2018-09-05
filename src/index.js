require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const express = require('express');
const app = express();
bot.on('ready', function (evt) {
    console.log('Connected');
});

bot.on("message", message => {
    console.log(message);
});


require('./features/welcome-newcomers')(bot);
require('./features/update-guidelines')(bot,app);


app.listen(3000);

bot.login(process.env.discord_token)
    .catch((e) => console.log(e));

