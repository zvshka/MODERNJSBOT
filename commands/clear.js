const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = (bot, message, args) => {

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
  if(!args[0]) return message.channel.send("```Не указанно кол-во сообщений```").then(msg => {msg.delete(5000)});
  message.channel.bulkDelete(args[0], true).then(() => {
    message.channel.send({embed: {
      color : 0x00a8ff,
      fields: [{
        name: "Успех",
        value: (`Удалено ${args[0]}`)
      }]
    }}).then(msg => msg.delete(5000));
  });
}

module.exports.help = { 
  name: "clear"
}
