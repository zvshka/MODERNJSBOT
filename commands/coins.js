const Discord = require("discord.js");
const fs = require('fs');

module.exports.run = (bot, message, args) => {
  //!coins
  let coins = JSON.parse(fs.readFileSync("./utils/coins.json", "utf8"))
  
  if(!coins[message.guild.id]) {
    coins[message.guild.id] = {};
  }

  if(!coins[message.guild.id][message.author.id]){
    coins[message.guild.id][message.author.id] = {
      coins: 0
    };
  }

  let uCoins = coins[message.guild.id][message.author.id].coins;


  let coinEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor("#00FF00")
  .addField(":dollar:", uCoins);

  message.channel.send(coinEmbed).then(msg => {msg.delete(5000)});

}

module.exports.help = {
  name: "coins",
  usage: " ",
  desc: "монетки",
  group: "fun"
}
