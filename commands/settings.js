const Discord = require("discord.js");
const Options = require('../models/servOpt.js')
module.exports.run = (bot, message, args) => {
  var botconfig = require('../utils/botconfig.json')

  let logs = message.guild.channels.find(c => c.name === 'logs')
  Options.findOne({
    ServerID: message.guild.id
  }, (err, opts) => {
    if (err) {
      console.log(err)
    }
    try {
      let setemb = new Discord.RichEmbed()
        .addField("Префикс", opts.Prefix, true)
        .addField("Log-канал", logs, true)
        .addField("autorole", opts.AutoRole, true)
        .setThumbnail(bot.user.avatarURL)
        .addField("Владелец сервера", message.guild.owner, true)
      message.channel.send(setemb)
    } catch (e) {
      console.log("нет в бд")
    }
  })
}

module.exports.help = {
  name: "settings",
  usage: " ",
  desc: "настройки бота",
  group: "fun"
}