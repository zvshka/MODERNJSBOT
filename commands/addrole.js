const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {

  //!addrole @andrew Dog Person
  if (!message.member.hasPermission("MANAGE_ROLES")) return errors.noPerms(message, "MANAGE_ROLES");
  let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if (!rMember) return errors.cantfindUser(message.channel);
  let role = args.join(" ").slice(22);
  if (!role) return message.reply("Роль!");
  let gRole = message.guild.roles.find(r => r.name === role);
  if (!gRole) return message.reply("Роль не найдена.");

  if (rMember.roles.has(gRole.id)) return message.reply("Роль имеется.");
  await (rMember.addRole(gRole.id));

  try {
    await rMember.send(`Роль выдана ${gRole.name}`)
  } catch (e) {
    console.log(e.stack);
    message.channel.send(`Роль выдана <@${rMember.id}>. Личка закрыта.`)
  }
}

module.exports.help = {
  name: "addrole",
  usage: "<@member> <роль>",
  desc: "Добавить роль",
  group: "mod"
}
