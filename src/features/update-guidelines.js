module.exports = (bot, app) => {
    app.post('/guidelines',(req,res) => {
        bot.channels.get(process.env.guidelines_channel_id).send('hey hey');
        console.log(req.body);
        res.status(200).send();
    });
};