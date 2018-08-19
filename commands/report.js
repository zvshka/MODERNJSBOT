const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {
  //!report @noob this is the Reaso
  let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!rUser) return message.channel.send("Нет юзера.");
  let reason = args.join(" ").slice(22);

  let reportEmbed = new Discord.RichEmbed()
    .setDescription("Репорт")
    .setColor("#f99b70")
    .addField("Зарепочен", `${rUser} with ID: ${rUser.id}`)
    .addField("Репорт от", `${message.author} with ID: ${message.author.id}`)
    .addField("Канал", message.channel)
    .addField("Время", message.createdAt)
    .addField("Причина", reason)
    .setFooter(`${message.author.username}`, message.author.avatarURL)
  let reportschannel = message.guild.channels.find(`name`, "logs");
  if (!reportschannel) return message.channel.find("Couldn't find reports channel");
  message.delete().catch(O_o => {});
  reportschannel.send(reportEmbed);
  return;
}

module.exports.help = {
  name: "report"
}