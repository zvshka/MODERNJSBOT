const Discord = require("discord.js");
const fs = require("fs");


module.exports.run = async (bot, message, args) => {  
  let warns = JSON.parse(fs.readFileSync("./utils/warnings.json", "utf8"));
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.channel.send({embed: {
    color: 0x00a8ff,
    fields: [{
      name: "Ошибка",
      value: "Не указанн узер"
   }]
  }}).then(msg => {msg.delete(15000)});
  
  if(!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };
  
  let warnlevel = warns[wUser.id]["warns"];
  
  
  if(wUser) return message.channel.send({embed:{
    color: 0x00a8ff,
    fields: [{
      name: "Человек",
      value: `<@${wUser.id}>`,
    },
    {
      name: "Варнов",
      value: `${warnlevel}`
    }]
  }}).then(msg => {msg.delete(15000)});
}

module.exports.help = {
  name: "warnlevel"
}
