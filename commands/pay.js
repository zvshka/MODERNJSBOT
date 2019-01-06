const Discord = require("discord.js");
const fs = require("fs");
const db = require('mongoose')
const user = require("../models/user.js")
db.connect(process.env.DB, {
  useNewUrlParser: true
})
module.exports.run = (bot, message, args) => {
  //!pay @isatisfied 59345
  let pUser = message.guild.member(message.mentions.users.first());

  if (!pUser) return message.reply(`ничего не указанно`).then(msg => {
    msg.delete(5000)
  });

  if (!args[1]) return message.reply('Не указанно кол-во монет');

  user.findOne({
    SeverID: message.guild.id,
    UserID: message.author.id
  }, (err, data1) => {
    if (err) {
      console.log(err.stack)
    }
    if (data1) {
      user.findOne({
        SeverID: message.guild.id,
        UserID: pUser.id
      }, (err, data2) => {
        if (err) {
          console.log(err.stack)
        }
        if (data2) {
          if(data1.Money >= parseInt(args[1])) {
            data1.Money = data1.Money - parseInt(args[1])
            data1.save().catch(err => console.log(err))
            data2.Money = data2.Money + parseInt(args[1])
            data2.save().catch(err => console.log(err))
            message.channel.send({embed: {
              fields: [{
                name: "Успех",
                value: `<@${message.author}> передал <@${pUser}> ${args[1]} монет`
              }]
            }})
          } else {
            message.channel.send({
            embed: {
              fields: [{
                name: "**Error**",
                value: "У вас не хватает монет"
          }]
        }
      })
          }
        }
      })
    } else {
      const newUser1 = new user({
        SeverID: message.guild.id,
        User: message.author.id,
        Money: 0,
        Warns: 0
      })
      newUser1.save().catch(err => console.log(err.stack))
      message.channel.send({
        embed: {
          fields: [{
            name: "**Error**",
            value: "У вас не хватает монет"
          }]
        }
      })
    }
  })

}

module.exports.help = {
  name: "pay",
  usage: "<@member> <кол-во>",
  desc: "отправить монетки кому то",
  group: "fun"
}