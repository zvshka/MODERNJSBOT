const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const errors = require('../utils/errors')
const db = require('mongoose')
const Warns = require("../models/warns.js")

db.connect(process.env.USERSDB, {
  useNewUrlParser: true
})
module.exports.run = (bot, message, args) => {
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


  let reason = args.join(" ").slice(22);
  if (!reason) return message.channel.send({
    embed: {
      color: 0x00a8ff,
      fields: [{
        name: "Ошибка",
        value: "Не указанн человек"
      }]
    }
  })

  Warns.findOne({
    UserID: wUser.id,
    ServerID: message.guild.id,
  }, (err, warn) => {
    if (err) {
      console.log(err)
    }
    if (!warn) {
      const newWarns = new Warns({
        UserID: wUser.id,
        ServerID: message.guild.id,
        warns: 1,
      })
      newWarns.save().catch(err => console.log(err))
      
      let warnEmbed = new Discord.RichEmbed()
        .setDescription("Warns")
        .setAuthor(message.author.username)
        .setColor("#fc6400")
        .addField("Заварнен", `<@${wUser.id}>`)
        .addField("Заварнен в", message.channel)
        .addField("Варнов", newWarns.warns)
        .addField("Причина", reason)
        .setFooter(`${message.author.username}`, message.author.avatarURL)
      let warnchannel = message.guild.channels.find(c => c.name === "logs");
      if (!warnchannel) return message.reply("Канал не найден").then(msg => {
        msg.delete(5000)
      });

      message.delete()
      warnchannel.send(warnEmbed);
    } else {
      warn.warns += 1
      warn.save().catch(err => console.log(err.stack))

      let warnEmbed = new Discord.RichEmbed()
        .setDescription("Warns")
        .setAuthor(message.author.username)
        .setColor("#fc6400")
        .addField("Заварнен", `<@${wUser.id}>`)
        .addField("Заварнен в", message.channel)
        .addField("Варнов", warn.warns)
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