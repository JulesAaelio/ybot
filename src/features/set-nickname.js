const mailRegexp = /^(.*)\.(.*)@ynov.com$/;
module.exports = (bot, app, db) => {

    const resetNicknames = async (guildId) => {
        const validations = db.Validation.findAll({
            where: {
                guildId: guildId
            }
        });
        const guild = bot.guilds.get(guildId);
        if(!guild) {
            throw new Error("Guild not found");
        }

        for (let i = 0; i < validations.length; i++) {
            if(validations[i].email) {
                    const member = guild.members.get(validations[i].userId);
                    const nickname = parseNameFromEmail(validations[i].email);
                    if(nickname && member) {
                        member.setNickname(nickname).then(() => {
                            console.log(`Nickname has been set for user ${member.id}`)
                        });
                    }
                }
            }
    };

    const setNickname =  async (user, email = null) => {
           try {
               if(email == null) {
                   const validation = await db.Validation.findOne({
                       where: {
                           userId : user.id,
                           guildId : user.guild.id,
                       }
                   });
                   if(validation && validation.email) {
                        email = validation.email;
                   } else {
                       console.log('Unable to find email.')
                   }
               }
               if(email) {
                   const nickname = parseNameFromEmail(email);
                   if(nickname) {
                       user.setNickname(nickname).then(() => {
                           console.log(`Nickname has been set for user ${user.id}`)
                       });
                   }
               }
           } catch (e) {
               console.log('Something went wrong setting up the nickname');
               console.error(e);
           }
    };

    return {
        resetNicknames,
        setNickname
    }
};




parseNameFromEmail = (email) => {
    let matches = email.match(mailRegexp);
    if (matches) {
        if (matches[1] && matches[2]) {
            const firstname = matches[1].replace(/^\w/, c => c.toUpperCase());
            const surname = matches[2].toUpperCase();
            return `${surname} ${firstname} `
        }
    }
    throw new Error('invalid email');
};