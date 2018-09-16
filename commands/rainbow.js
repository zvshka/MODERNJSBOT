const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const fs = require('fs')
module.exports.run = async (bot, message, args) => {
  let rMember = message.guild.member(message.author)
  let color = `0x` + args[0];
  if (color.length !== 8) {
    message.delete()
    message.reply("Цвет не подходит")
  }
  if (!rMember) return errors.cantfindUser(message.channel);
  let gRole = message.guild.roles.find(r => r.name === rMember.id);
  if (!gRole) {
    message.guild.createRole({
      name: rMember.id,
      color: color
    }).then(r => rMember.addRole(r.id))
  } else if (gRole) {
    gRole.edit({
      name: rMember.id,
      color: color
    }).then(r => rMember.addRole(r.id))
  }
  message.delete()
}

module.exports.help = {
  name: "rainbow",
  usage: " <hex-код цвета>",
  desc: "Выдача себе любого цвета",
  group: "fun"
}