module.exports = (bot, app, db) => {
    const getPicture =  async (arguments, message) => {
        if(message.mentions.users.array().length <= 0) {
            await message.reply('Please tag a user.')
        }

        const user = message.mentions.users.array()[0];
        const trombi = await db.Trombi.find({
            where: {
                userId: user.id,
                guildId : message.member.guild.id,
            }
        });
        if(!trombi) {
           await message.reply('No entry found in trombi');
        } else {
            await message.reply(trombi.picture);
        }
    };

    const setPicture = async (arguments, message) => {
      const user = message.member;
      let picture;
      if(message.attachments.array().length > 0) {
            picture  = message.attachments.first().proxyURL;
      } else {
          picture = arguments[0];
      }
      const trombi = await db.Trombi.find({
          where : {
              userId: user.id,
              guildId: user.guild.id,
          }
      });
      if(trombi) {
          await trombi.update({
              picture: picture
          })
      } else {
          await db.Trombi.create({
              userId : user.id,
              guildId : user.guild.id,
              picture: picture,
          })
      }
    };



    return {
        getPicture,
        setPicture
    }
};
