const mailRegexp = /^(.*)\.(.*)@ynov.com$/;
module.exports = (bot, app, db) => {
    return async (user, email = null) => {
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
    }
};

parseNameFromEmail = (email) => {
    let matches = email.match(mailRegexp);
    if (matches) {
        if (matches[1] && matches[2]) {
            const firstname = matches[1].replace(/^\w/, c => c.toUpperCase());
            const surname = matches[2].toUpperCase();
            return `${firstname} ${surname}`
        }
    }
    throw new Error('invalid email');
};