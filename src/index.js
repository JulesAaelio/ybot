require('dotenv').config();
console.log(`[LIFECYCLE] Application started at ${new Date()}`);
const Discord = require('discord.js');
const bot = new Discord.Client();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('src/assets'));
app.set('view engine', 'pug');
app.set('views','./src/templates');

bot.on('ready', function (evt) {
    console.log(`Connected at ${new Date()} !`);
});

(async () => {
    const database = await require('./utils/database')();

    require('./features/welcome-newcomers')(bot);
    require('./features/update-guidelines')(bot,app);
    require('./features/send-confirmation')(bot,app, database);
    require('./features/validate-confirmation')(bot,app, database);

    bot.login(process.env.discord_token)
        .catch((e) => console.log(e));

    app.listen(3000);

})();





