const moment = require('moment');
const helpers = {};
helpers.timeago = timestamp => {
    //a partir del tiempo que se sube la img 
    //dira cuanto tiempo a pasado
    return moment(timestamp).startOf('minute').fromNow();

};

module.exports = helpers;