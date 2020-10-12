const MessageEmbed = require('discord.js').MessageEmbed;

module.exports = (bot, app, db) => {

    const sendMessage = async (commandArguments, message) => {
        if(!message.member.roles.cache.has(process.env.moderator_role_id)) {
            message.reply(`You need to be a <@&${process.env.moderator_role_id}> to do this`);
            return;
        }

        // Build matching table.
        const emojiRoles = [];
        let newMessage = '';
        for (let i = 0; i < commandArguments.length; i++) {
            let argument = commandArguments[i].split(':');
            if(argument.length !== 2)
            {
                message.reply('Error : Invalid arguments')
                throw new Error('Invalid arguments')
            }

            let role = message.guild.roles.resolve(argument[1].replace(/\D/g,''));
            if(!role){
                message.reply('Error : Invalid role argument. You need to tag the roles')
                throw new Error('Invalid role argument')
            }

            emojiRoles.push({emoji: argument[0].trim(), role: role});
        }

        for (let i = 0; i < emojiRoles.length; i++) {
            newMessage = newMessage.concat(`${emojiRoles[i].emoji}:${emojiRoles[i].role}\n`);
        }

        // Send message and add emojis.
        const embedMessage = new MessageEmbed()
            .setTitle('React to this message to get your roles : ')
            .setColor(0xff0000)
            .setDescription(newMessage);
        // Send the embed to the same channel as the message
        const collectorMessage = await message.channel.send(embedMessage);
        for (let i = 0; i < emojiRoles.length; i++) {
            collectorMessage.react(emojiRoles[i].emoji);
        }

        const reactionCollector =  collectorMessage.createReactionCollector((reaction) => {
            return emojiRoles.map(emojiRole => emojiRole.emoji).includes(reaction.emoji.name);
        });

        reactionCollector.on("collect", (reaction, user) => {
            if(user.bot) {
                return
            }
            let emojiRole =  emojiRoles.find(er => {
                return er.emoji === reaction.emoji.name;
            })
            message.guild.members.resolve(user.id).roles.add(emojiRole.role);
            console.log(`[ROLE] ${user.username} requested role ${emojiRole.role.name}`)
        });
    }

    return {
        sendMessage
    }
};

