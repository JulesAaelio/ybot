const request = require('request-promise-native');

module.exports = request.defaults({
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'Awesome-NodeJS-App'
    }
});