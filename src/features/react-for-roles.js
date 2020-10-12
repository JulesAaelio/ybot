module.exports = (bot, app, db) => {
    const sendMessage = async (arguments, message) => {
        if(!message.member.roles.cache.has(process.env.moderator_role_id)) {
            message.reply(`You need to be a <@&${process.env.moderator_role_id}> to do this`);
            return;
        }

        // Build matching table.
        const emojiRoles = [];
        let newMessage = '';
        for (let i = 0; i < arguments.length; i++) {
            let argument = arguments[i].split(':');
            if(arguments.length !== 2)
            {
                message.reply('Error : Invalid arguments')
                throw new Error('Invalid arguments')
            }

            let role = message.guild.roles.resolve(argument[1].replace(/\D/g,''));

            emojiRoles.push({emoji: argument[0].trim(), role: role});
        }

        for (let i = 0; i < emojiRoles.length; i++) {
            newMessage = newMessage.concat(`${emojiRoles[i].emoji}:${emojiRoles[i].role}`);
        }

        const collectorMessage = await message.channel.send(newMessage);
        const reactionCollector =  collectorMessage.createReactionCollector((reaction) => {
            return emojiRoles.map(emojiRole => emojiRole.emoji).includes(reaction.emoji.name);
        });

        reactionCollector.on("collect", (reaction, user) => {
            let emojiRole =  emojiRoles.find(er => {
                return er.emoji = reaction.emoji.name;
            })
            message.guild.members.resolve(user.id).roles.add(emojiRole.role);
            console.log(`[ROLE] ${user.username} requested role ${emojiRole.role.name}`)
        });
    }

    return {
        sendMessage
    }
};

