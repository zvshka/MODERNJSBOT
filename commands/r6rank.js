const R6Api = require('r6-discord');
const R6 = new R6Api();


module.exports.run = async (bot, message, args) => { // Get stats on a user on that platform.
    const username = args[0];
    const platform = args[1];
    
    R6.stats(username, platform, /* Optional Boolean if you want operator stats. */ ).then(response => {
        console.log(response);
    }).catch(error => {
        console.error(error);
    });

    // Get details on a user on R6 depending on platform.
    R6.profile(username, platform).then(response => {
        console.log(response);
    }).catch(error => {
        console.error(error);
    });
}

module.exports.help = {
    name: "r6rank"
}