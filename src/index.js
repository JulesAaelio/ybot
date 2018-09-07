require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

bot.on('ready', function (evt) {
    console.log(`Connected at ${new Date()} !`);
});

require('./features/welcome-newcomers')(bot);
require('./features/update-guidelines')(bot,app);

require('./features/send-confirmation')().then((err, info) => {
    console.log(err);
    console.log(info);
});

app.listen(3000);

bot.login(process.env.discord_token)
    .catch((e) => console.log(e));

