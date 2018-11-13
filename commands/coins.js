const Discord = require("discord.js");
const fs = require('fs');
const db = require('mongoose')
const Coins = require("../models/coins.js")
db.connect(process.env.USERSDB, {
  useNewUrlParser: true
})
module.exports.run = (bot, message, args) => {
  //!coins
    Coins.findOne({
      UserID: message.author.id,
      ServerID: message.guild.id,
    }, (err, coins) => {
      if (err) {
        console.log(err)
      }
      if (!money) {
        const newMoney = new Coins({
          UserID: message.author.id,
          ServerID: message.guild.id,
          money: 0,
        })
        newMoney.save().catch(err => console.log(err.stack))
        let coinEmbed = new Discord.RichEmbed()
          .setAuthor(message.author.username)
          .setColor("#00FF00")
          .addField(":dollar:", `**${newMoney.money}**`);

        message.channel.send(coinEmbed).then(msg => {
          msg.delete(5000)
        });

      } else {
        let coinEmbed = new Discord.RichEmbed()
          .setAuthor(message.author.username)
          .setColor("#00FF00")
          .addField(":dollar:", `**${coins.money}**`);

        message.channel.send(coinEmbed).then(msg => {
          msg.delete(5000)
        });
      
      }
    })
  }

module.exports.help = {
  name: "coins",
  usage: " ",
  desc: "монетки",
  group: "fun"
}