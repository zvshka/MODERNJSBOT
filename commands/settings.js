const Discord = require("discord.js");
const fs = require("fs");




module.exports.run = (bot, message, args) => {
  var botconfig = require('..1/utils/botconfig.json')
  let prefixes = JSON.parse(fs.readFileSync("./utils/prefixes.json", "utf8"));
  let autorole = JSON.parse(fs.readFileSync('./utils/autoroles.json', 'utf8'))
  if(!autorole[message.guild.id]) autorole[message.guild.id] = {
    role: "off"
  }
  
  if (!prefixes[message.guild.id]) {
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

  let logs = message.guild.channels.find(`name`, "logs")

  let testembed = new Discord.RichEmbed()
    .addField("Префикс", prefixes[message.guild.id].prefixes, true)
    .addField("Log-канал", logs, true)
    .addField("autorole", autorole[message.guild.id].role, true)
    .setThumbnail(bot.user.avatarURL)
    .addField("Владелец сервера", message.guild.owner, true)
  message.channel.send(testembed)
}

module.exports.help = {
  name: "settings"
}