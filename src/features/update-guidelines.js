module.exports = (bot, app) => {
    app.get('/guidelines',(req,res) => {
        bot.channels.get(process.env.guidelines_channel_id).send('hey hey');
        res.status(200).send();
    });
};