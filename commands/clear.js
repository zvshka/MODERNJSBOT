const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = (bot, message, args) => {

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
  if (!args[0]) return message.channel.send("```Не указанно кол-во сообщений```").then(msg => {
    msg.delete(5000)
  });
  if (args[0].toLowerCase() === 'total') {
    let toclear = message.channel
    toclear.delete()
    message.guild.createChannel(`${toclear.name}`, `text`, )
      .then(chnl => {
        chnl.setParent(toclear.parent.id)
        chnl.setPosition(`${toclear.position}`)
        chnl.send({
          embed: {
            fields: [{
              name: "Успех",
              value: "Канал полностью очищен"
            }]
          }
        }).then(msg => msg.delete(15000))
        chnl.overwritePermissions()
      }) 
  } else {
    message.channel.bulkDelete(args[0], true).then(() => {
      message.channel.send({
        embed: {
          color: 0x00a8ff,
          fields: [{
            name: "Успех",
            value: (`Удалено ${args[0]}`)
          }]
        }
      }).then(msg => msg.delete(5000));
    });
  }

}

module.exports.help = {
  name: "clear",
  usage: "<3-100>",
  desc: "очистка сообщений",
  group: "mod"
}