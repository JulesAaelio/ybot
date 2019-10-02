const jwt = require('jsonwebtoken');

module.exports =  (bot, app, db) => {
    const setNickname = require('./set-nickname')(bot, app, db);
    const setPredefinedRoles = require('./set-predefined-roles')(bot, app, db);

    app.get('/validate', async (req, res) => {
        if (req.query && req.query.token) {
            try {
                let validation;
                try {
                    validation = await validate(req.query.token, db);
                    res.render('activated');
                }catch (e) {
                    res.status(401).send(e.message);
                }

                if(validation) {
                    const user = bot.guilds.get(validation.guildId).members.get(validation.userId);

                    const validationActions = [];
                    validationActions.push(setNickname(user, validation.email));
                    validationActions.push(setPredefinedRoles(user, validation.email));

                    Promise.all(validationActions).then(async () => {
                        await sendConfirmationMessage(user);
                    });
                }
            } catch(e) {
               console.log('Une erreur est survenue lors du paramétrage de votre compte');
               console.log(e);
            }
        } else {
            res.status(401).send('Missing query parameter : token');
        }
    });

    async function sendConfirmationMessage(user){
        const { channelId } = await db.SpecificChannel.findOne({
            where: {
                guildId: user.guild.id,
                role: 'ARRIVALS'
            }
        });
        if(channelId) {
            const channel = bot.channels.get(channelId);
            channel.send(`${user} You're email has been verified - You know have a beautiful name and predefined roles for you. Feel free to contact moderation team.`);
        }
    }



    async function validate(token) {
        let payload;
        try {
            payload = jwt.verify(token, process.env.jwt_secret);
        } catch (e) {
            throw new Error('Invalid or expired token');
        }

        const validation = await db.Validation.findOne({
            where: {
                userId: payload.userId,
                guildId: payload.guildId,
                email: payload.email,
            }
        });

        if (!validation) {
            throw new Error('No validation associated with this token !')
        }

        if (validation && validation.validated) {
            throw new Error('Already activated account !')
        }

        return await validation.update({
            validated: true
        });
    }

};
