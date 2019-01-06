const Discord = require("discord.js");
const fs = require('fs');
const db = require('mongoose')
const user = require("../models/user.js")
db.connect(process.env.DB, {
  useNewUrlParser: true
})
module.exports.run = (bot, message, args) => {
  //!coins
    message.delete(5000)
    user.findOne({
      UserID: message.author.id,
      ServerID: message.guild.id,
    }, (err, data) => {
      if (err) {
        console.log(err)
      }
      if (!data) {
        const newData = new user({
          UserID: message.author.id,
          ServerID: message.guild.id,
          Money: 0,
          Warns: 0
        })
        newData.save().catch(err => console.log(err.stack))
        let coinEmbed = new Discord.RichEmbed()
          .setAuthor(message.author.username)
          .setColor("#00FF00")
          .addField(":dollar:", `**${newData.Money}**`);

        message.channel.send(coinEmbed).then(msg => {
          msg.delete(5000)
        });

      } else {
        let coinEmbed = new Discord.RichEmbed()
          .setAuthor(message.author.username)
          .setColor("#00FF00")
          .addField(":dollar:", `**${data.Money}**`);

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