const Discord = require("discord.js");
const ms = require("ms");
const errors = require('../utils/errors')
const user = require("../models/user.js")
module.exports.run = (bot, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return errors.noPerms(message, "ADMINISTRATOR").then(msg => {
    msg.delete(5000)
  });

  let wUser = message.guild.member(message.mentions.users.first())

  if (!wUser) return message.channel.send({
    embed: {
      color: 0x00a8ff,
      description: "Не указан человек"
    }
  });

  let reason = args.join(" ").slice(22);
  if (!reason) return message.channel.send({
    embed: {
      color: 0x00a8ff,
      fields: [{
        name: "Ошибка",
        value: "Без причины"
      }]
    }
  })

  user.findOne({
    UserID: wUser.id,
    ServerID: message.guild.id,
  }, (err, data) => {
    if (err) {
      console.log(err)
    }
    if (!data) {
      const newData = new user({
        UserID: wUser.id,
        ServerID: message.guild.id,
        Money: 0,
        Warns: 1,
      })
      newData.save().catch(err => console.log(err))
      
      let warnEmbed = new Discord.RichEmbed()
        .setDescription("Warns")
        .setAuthor(message.author.username)
        .setColor("#fc6400")
        .addField("Заварнен", `<@${wUser.id}>`)
        .addField("Заварнен в", message.channel)
        .addField("Варнов", newData.Warns)
        .addField("Причина", reason)
        .setFooter(`${message.author.username}`, message.author.avatarURL)
      let warnchannel = message.guild.channels.find(c => c.name === "logs");
      if (!warnchannel) return message.reply("Канал не найден").then(msg => {
        msg.delete(5000)
      });

      message.delete()
      warnchannel.send(warnEmbed);
    } else {
      data.Warns += 1
      data.save().catch(err => console.log(err.stack))

      let warnEmbed = new Discord.RichEmbed()
        .setDescription("Warns")
        .setAuthor(message.author.username)
        .setColor("#fc6400")
        .addField("Заварнен", `<@${wUser.id}>`)
        .addField("Заварнен в", message.channel)
        .addField("Варнов", data.Warns)
        .addField("Причина", reason)
        .setFooter(`${message.author.username}`, message.author.avatarURL)
      let warnchannel = message.guild.channels.find(c => c.name === "logs");
      if (!warnchannel) return message.reply("Канал не найден").then(msg => {
        msg.delete(5000)
      });

      message.delete()
      warnchannel.send(warnEmbed);
    }
  })

}

module.exports.help = {
  name: "warn",
  usage: "<@member> <причина>",
  desc: "warning system",
  group: "mod"
}