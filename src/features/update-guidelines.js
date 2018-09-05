module.exports = (bot, app) => {
    app.post('/guidelines',(req,res) => {
        if(req.body.ref && req.body.ref === process.env.guidelines_tracked_ref) {
            console.log('guidelines master updated');
        }
        res.status(200).send();
    });
};