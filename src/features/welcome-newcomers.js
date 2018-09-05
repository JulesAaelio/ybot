module.exports = (bot) => {
    bot.on("guildMemberAdd", member => {
        member.guild.channels.get(process.env.newcomers_channel_id).send(`Bienvenue ${member.user} ! `);
    });

};