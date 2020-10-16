const MessageEmbed = require('discord.js').MessageEmbed;

module.exports = (bot, app, db) => {
    const sendHelp =  async (arguments, message) => {
        const embed =  new MessageEmbed()
            .setTitle('Ybot - Commandes disponibles ')
            .setColor(0xff0000)
            .setDescription('\`!y help\` : Show help message\n' +
                '\`!y trombi whois @someone\`\` : Show picture of user if registered\n' +
                '\`!y trombi set-picture <link>\` : Set your picture, you can also add an attachment\n' +
                '\`!y nickname <nickname>\` : Change your nickname\n' +
                '\`!y validate <youradress@ynov.com>\` : Send confirmation email\n');


        message.reply(embed)

        if(!message.member.roles.cache.has(process.env.moderator_role_id)) {
            const adminEmbed =  new MessageEmbed()
                .setTitle('Ybot - Commandes disponibles ')
                .setColor(0xff0000)
                .setDescription('**!y roles <emoji:@role> <emoji:@role> ...** : Send message with reactions to get roles ' );
            message.reply(adminEmbed);
        }
    };



    return {
       sendHelp
    }
};
