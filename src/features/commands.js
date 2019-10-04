module.exports = (bot, app, db) => {
    bot.on('message', async (message) => {
        if(message.content.startsWith('!y')) {
            const messageParts = message.content.split(' ');
            if(messageParts.length >= 2) {
                const command = messageParts[1];
                const arguments = messageParts.slice(2);
                console.log(`[COMMAND] ${command} | ${arguments}`);

                switch (command) {
                    case 'validate':
                        require('./send-confirmation')(bot,app,db)(arguments, message);
                        break;
                    case 'nickname':
                        try {
                            require('./change-nickname')(bot,app,db)(arguments, message);
                        } catch (e) {
                            await message.reply(e.message);
                        }
                        break;
                    case 'reset-nickname':
                        try {
                            require('./set-nickname')(bot,app,db).resetNicknames(message.guild.id);
                        }catch (e) {
                            console.error(e);
                            await message.reply("Sorry, it didn't work.");
                        }
                        break;
                }
            }


        }
    });
};