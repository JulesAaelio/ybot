module.exports = (bot, app, db) => {
    return async (user, email) => {
        let { roles } = await db.PredefinedRole.findOne( {
            where : {
                guildId: user.guild.id,
                email: email
            }
        });

        if(roles) {
            roles = JSON.parse(roles);
            for (let i = 0; i < roles.length; i++) {
                user.addRoles(roles).then(() => {
                    console.log(`Roles has been set up for user ${user.id}`)
                })
            }
        }
    }
};