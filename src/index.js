require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const express = require('express');
const bodyParser = require('body-parser');
const database = require('./utils/database');
const app = express();

app.use(bodyParser.json());
app.use(express.static('src/assets'));

bot.on('ready', function (evt) {
    console.log(`Connected at ${new Date()} !`);
});

require('./features/welcome-newcomers')(bot);
require('./features/update-guidelines')(bot,app);

app.listen(3000);

bot.login(process.env.discord_token)
    .catch((e) => console.log(e));

