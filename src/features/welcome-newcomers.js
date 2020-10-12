module.exports = (bot, database) => {
    bot.on("guildMemberAdd", async member => {

        const { channelId } = await database.SpecificChannel.findOne({
            where: {
                guildId: member.guild.id,
                role: 'ARRIVALS'
            }
        });
        if(channelId) {
            member.guild.channels.get(channelId).send(`Bienvenue ${member.user} ! Please use !y validate \`your.address@ynov.com\` to get your roles ! `);
        }
    });

};