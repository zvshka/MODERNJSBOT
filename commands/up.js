const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {

  //!addrole @andrew Dog Person
  if (!args[0]) {
    let rMember = message.guild.member(message.author.id)
    if (!rMember) return errors.cantfindUser(message.channel);
    let role = "Собеседуемый";
    if (!role) return message.reply("Роль!");
    let gRole = message.guild.roles.find(r => r.name === role);
    if (!gRole) return message.reply("Роль не найдена.");
    let dRole = message.guild.roles.find(r => r.name === 'Гость')
    if (rMember.roles.has(dRole.id)){
      await (rMember.removeRole(dRole.id)).catch
    }
    if (rMember.roles.has(gRole.id)) return message.reply("Роль имеется.");
    await (rMember.addRole(gRole.id)).catch;

    try {
      await rMember.send(`Роль выдана ${gRole.name}`)
    } catch (e) {
      console.log(e.stack);
      message.channel.send(`Роль выдана <@${rMember.id}>, была выдана роль ${gRole.name}. Личка закрыта.`)
    }
  }

  if(args[0]) {
    let admrole = message.guild.roles.find(r => r.name === "Administrator")
    let sobesrole = message.guild.roles.find(r => r.name === "Собеседуемый")
    let member = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    let vstuprole = message.guild.roles.find(r => r.name === "Вступивший")
    let mauthor = message.guild.member(message.author.id)
    if(mauthor.roles.has(admrole.id)) {
      if(member.roles.has(sobesrole.id)) {  
        member.removeRole(sobesrole.id)
        member.addRole(vstuprole.id)
      } else {
        member.send(`У тебя нет роли ${sobesrole.name} пропиши up чтобы её получить`)
        message.author.send(`У ${member.user.username} нет роли собеседуемый`)
      }
    } else {
      member.send("Ты не имеешь прав")
    }
  }
}

module.exports.help = {
  name: "up",
  usage: " ",
  desc: "повышение до Собеседуемого/Вступившиго",
  group: "mod"
}