const Discord = require("discord.js");
const fs = require("fs");
const botconfig = require('../utils/botconfig.json');
const db = require('mongoose')
const Options = require('../models/servOpt.js')
db.connect(process.env.DB, {
  useNewUrlParser: true
})
module.exports.run = (bot, message, args) => {

  if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Нет.");
  if (!args[0] || args[0 == "help"]) return message.channel.send({
    embed: {
      fields: [{
        name: "Использование",
        value: "!prefix <префикс>"
      }]
    }
  }).then(msg => {
    msg.delete(15000)
  });

  let sEmbed = new Discord.RichEmbed()
    .setColor("#FF9900")
    .addField('**Prefix Set!**', `**Префикс утсновлен ${args[0]}**`)

  Options.findOne({
    ServerID: message.guild.id
  }, (err, opts) => {
    if (err) {
      console.log(err)
    }
    try {
      opts.Prefix = args[0]
      opts.save().catch(err => console.log(err.stack))
      message.guild.members.get(bot.user.id).setNickname(`[${opts.Prefix}] ${message.guild.members.get(bot.user.id).displayName.slice(4)}`)
    } catch (e) {
      console.log(e.stack)
    }
  })
 
  message.channel.send(sEmbed);
}

module.exports.help = {
  name: "prefix",
  usage: "<префикс>",
  desc: "настроить префикс",
  group: "mod"
}