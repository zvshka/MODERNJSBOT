const Discord = require("discord.js");
const fs = require("fs");
const fetch = require('node-fetch')

module.exports.run = (bot, message, args) => {

  if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Нет.");
  if(!args[0] || args[0 == "help"]) return message.channel.send({embed: {
    fields: [{
      name: "Использование",
      value: "!prefix <префикс>"
    }]
  }}).then(msg => {msg.delete(15000)});

  let prefixes = JSON.parse(fs.readFileSync("./utils/prefixes.json", "utf8"));

  prefixes[message.guild.id] = {
    prefixes: args[0]
  };

  fs.writeFile("./utils/prefixes.json", JSON.stringify(prefixes), (err) => {
    if (err) console.log(err)
  });
  fetch(`${process.env.PREFIXES_URL}`,  { 
    method: 'PUT',
    body:    JSON.stringify(prefixes),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res => res.json())
  .then(json => console.log(json))
  
  let sEmbed = new Discord.RichEmbed()
  .setColor("#FF9900")
  .setTitle("Prefix Set!")
  .setDescription(`Префик установлен: ${args[0]}`);

  message.channel.send(sEmbed);
  let prefix = prefixes[message.guild.id].prefixes
  message.guild.members.get(bot.user.id).setNickname(`[${prefix}] ${bot.user.username}`);
}

module.exports.help = {
  name: "prefix",
  usage: "<префикс>",
  desc: "настроить префикс",
  group: "mod"
}
