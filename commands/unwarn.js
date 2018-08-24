const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const errors = require('../utils/errors')
const fetch = require('node-fetch')

module.exports.run = async (bot, message, args) => {
  let warns = JSON.parse(fs.readFileSync("./utils/warnings.json", "utf8"));
  if (!message.member.hasPermission("ADMINISTRATOR")) return errors.noPerms(message, "ADMINISTRATOR").then(msg => {
    msg.delete(5000)
  });

  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])

  if (!wUser) return message.channel.send({
    embed: {
      color: 0x00a8ff,
      description: "Не указан человек"
    }
  });

  if (!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };
  
  if(warns[wUser.id].warns >= 1) {
    warns[wUser.id].warns--;
  } else {
      return message.channel.send("Нет варнов")
  }

  fs.writeFile("./utils/warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });
   
  fetch(`${process.env.WARNS_URL}`,  { 
    method: 'PUT',
    body:    JSON.stringify(warns),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res => res.json())
  .then(json => console.log(json))
  let warnEmbed = new Discord.RichEmbed()
    .setDescription("Warns")
    .setAuthor(message.author.username)
    .setColor("#fc6400")
    .addField("Варнов", warns[wUser.id].warns)
    .setFooter(`${message.author.username}`, message.author.avatarURL)
  let warnchannel = message.guild.channels.find(c => c.name === "logs");
  if (!warnchannel) return message.reply("Канал не найден").then(msg => {
    msg.delete(5000)
  });

  message.delete()
  warnchannel.send(warnEmbed);

}

module.exports.help = {
  name: "unwarn"
}