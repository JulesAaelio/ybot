const jwt = require('jsonwebtoken');
const mailRegexp = /^(.*)\.(.*)@ynov.com$/;

module.exports = (bot, app, db) => {
    app.get('/validate', (req, res) => {
        if (req.query && req.query.token) {
            validate(req.query.token, db).then((validation) => {
                res.render('activated');
                return validation;
            }, e => {
                res.status(401).send(e.message);
            }).then((validation) => {
                const user = bot.guilds.get(validation.guildId).members.get(validation.userId);
                return user.setNickname(parseNameFromEmail(validation.email));
            }).then((user) => {
                const channel = bot.channels.get(process.env.newcomers_channel_id);
                channel.send(`${user} You're email has been verified - You know can access global channels - You should receive your specific roles soon.`);
            }).catch(e => {
                console.log('Une erreur est survenue lors du paramétrage de votre compte');
            });

        } else {
            res.status(401).send('Missing query parameter : token');
        }
    });
};

function parseNameFromEmail(email) {
    let matches;
    if (matches = email.match(mailRegexp)) {
        if (matches[1] && matches[2]) {
            const firstname = matches[1].replace(/^\w/, c => c.toUpperCase());
            const surname = matches[2].toUpperCase();
            return `${firstname} ${surname}`
        }
    }
    throw new Error('invalid email');
}

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