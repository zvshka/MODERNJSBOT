const Discord = require("discord.js");
const user = require("../models/user.js")
module.exports.run = (bot, message, args) => {
  //!coins
  message.delete(5000)
  user.findOne({
    ServerID: message.guild.id,
    UserID: message.author.id
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