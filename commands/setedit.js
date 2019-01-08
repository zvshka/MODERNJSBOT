const Discord = require("discord.js");
const Options = require('../models/servOpt.js')

module.exports.run = (bot, message, args) => {
  if(args[0].toLowerCase() == "logs") {
    let logname = args.join(" ").slice(5)
    let logch = message.guild.channels.find(c => c.name == logname)
    if(logch) {
      
    }
  }
}

module.exports.help = {
  name: "setedit",
  usage: "<что-то>",
  desc: "изменить настройки сервера",
  group: "mod"
}