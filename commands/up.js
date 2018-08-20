const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {

  //!addrole @andrew Dog Person
  if (args[0] == "help") {
    message.reply("Использование: !addrole <user> <role>").then(msg => {msg.delete(5000)});
    return;
  }
  let rMember = message.guild.member(message.author.id)
  if (!rMember) return errors.cantfindUser(message.channel);
  let role = "Собеседуемый";
  if (!role) return message.reply("Роль!");
  let gRole = message.guild.roles.find(r => r.name === role);
  if (!gRole) return message.reply("Роль не найдена.");
  let dRole = message.guild.roles.find(r => r.name === 'Гость')
  if (rMember.roles.has(dRole.id))
  await (rMember.removeRole(dRole.id)).catch
  if (rMember.roles.has(gRole.id)) return message.reply("Роль имеется.");
  await (rMember.addRole(gRole.id)).catch;

  try {
    await rMember.send(`Роль выдана ${gRole.name}`)
  } catch (e) {
    console.log(e.stack);
    message.channel.send(`Роль выдана <@${rMember.id}>, была выдана роль ${gRole.name}. Личка закрыта.`)
  }
}

module.exports.help = {
  name: "up"
}
