const request = require('../utils/json-request');
module.exports = (bot, app) => {
    app.post('/guidelines', (req, res) => {
        flushChannel(bot.channels.get(process.env.guidelines_channel_id)).then(() => {
            if (req.body.ref && req.body.ref === process.env.guidelines_tracked_ref) {
                console.log('guidelines master updated');
                fetchAllGuidelines(req.body.repository.contents_url.replace('/{+path}', '')).then(guidelines => {
                    bot.channels.get(process.env.guidelines_channel_id).send(`@everyone\n\n ${guidelines['RULES.md']}`);
                    bot.channels.get(process.env.guidelines_channel_id).send(`@everyone\n\n ${guidelines['MANIFEST.md']}`);
                    bot.channels.get(process.env.guidelines_channel_id).send(`@everyone\n\n ${guidelines['NEWCOMERS_GUIDE.md']}`);
                })
            }
            res.status(200).send();
        })
    });
};

async function fetchAllGuidelines(url) {
    const guidelinesList = JSON.parse(await request(url));
    const guidelines = {};
    for(let file of guidelinesList) {
        guidelines[file.name] = await request(file.download_url);
    }
    return guidelines;
}

async function flushChannel(channel) {
    const messages = await channel.fetchMessages();
    messages.forEach((message) => {
       message.delete();
    });
}