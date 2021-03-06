module.exports = (bot, app, db) => {
    return async (arguments, message) => {
        if(arguments.length < 1) {
            await message.reply(`Usage : !y nickname NICKNAME`);
            return;
        }

        let user, newNickname;
        if(arguments.length >= 1) {
            user = message.member;
            newNickname = arguments.join(' ');
        } else if (arguments.length >= 2 ) {
            user = message.author;
            // We'll handle others nicknames changing that later
        }
        const nickname = user.nickname;
        const explodedNickname = nickname.match(/([^-]+)[-]{0,1}([^-]*)/);
        if(explodedNickname) {
            const updatedNickname =   `${explodedNickname[1].trim()} - ${newNickname}`;
            try {
                await user.setNickname(updatedNickname);
                console.log('Updated nickame')
            } catch (e) {
                console.log(`Something went wrong updating the nickname for ${user.id}`);
                console.error(e);
                if(e.message.includes('Must be 32 or fewer in length')){
                    throw new Error('Nickname is too long');
                }
            }

        }

    }
};