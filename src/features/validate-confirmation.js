const jwt = require('jsonwebtoken');

module.exports = (bot, app, db) => {
    app.get('/validate', (req, res) => {
        if (req.query && req.query.token) {
            validate(req.query.token, db).then((validation) => {
                const user = bot.guilds.get(validation.guildId).members.get(validation.userId);
                const channel = bot.channels.get(process.env.newcomers_channel_id);
                channel.send(`${user} You're email has been verified - You know can access global channels - You should receive your specific roles soon.`);
                res.send('');
            }).catch(e => {
                res.status(401).send(e.message);
            })

        } else {
            res.status(401).send('Missing query parameter : token');
        }
    });
};

async function validate(token, db) {
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

    return validation.update({
        validated: true
    });
}