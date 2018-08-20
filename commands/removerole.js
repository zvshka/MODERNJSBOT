const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {

  if (!message.member.hasPermission("MANAGE_ROLES")) return errors.noPerms(message, "MANAGE_ROLES");
  if(args[0] == "help"){
    message.reply("Использование: !removerole <user> <role>");
    return;
  }
  let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!rMember) return message.reply("Не найден юзер.");
  let role = args.join(" ").slice(22);
  if(!role) return message.reply("Роль!");
  let gRole = message.guild.roles.find(r => r.name === role);
  if(!gRole) return message.reply("Не найдена роль.");

  if(!rMember.roles.has(gRole.id)) return message.reply("Нет роли.");
  await(rMember.removeRole(gRole.id));

  try{
    await rMember.send(`Роль убрана ${gRole.name}.`)
  }catch(e){
    message.channel.send(`Роль убрана у <@${rMember.id}>, удалена рооь ${gRole.name} . Личка закрыта.`)
  }
}

module.exports.help = {
  name: "removerole"
}
