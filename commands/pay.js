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
  })

  if (!args[1]) return message.reply('Не указанно кол-во монет')

  user.findOne({
    SeverID: message.guild.id,
    UserID: message.author.id
  }, (err, user1) => {
    if (err) {
      console.log(err.stack)
    }
    if (user1) {
      user.findOne({
        SeverID: message.guild.id,
        UserID: pUser.id
      }, (err, user2) => {
        if (err) {
          console.log(err.stack)
        }
        if (user2) {
          user2.money = user2.money + parseInt(args[0])
          user2.save().catch(err => console.log(err.stack))
          user1.money = user1.money - parseInt(args[0])
          user1.save().catch(err => console.log(err.stack))
          message.channel.send(`${message.author} дал ${pUser} ${args[1]} монет.`).then(msg => {
            msg.delete(5000)
          });
        } else if (user1.money >= args[0]) {
          const newUser2 = new user({
            SeverID: message.guild.id,
            UserID: pUser.id,
            Money: 0 + parseInt(args[0]),
            Warns: 0
          })
          newUser2.save().catch(err => console.log(err.stack))
          user1.money = user1.money - parseInt(args[0])
          user1.save().catch(err => console.log(err.stack))
          message.channel.send(`${message.author} дал ${pUser} ${args[1]} монет.`).then(msg => {
            msg.delete(5000)
          });
        } else if (user1.money < args[0]) {
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