const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {
    message.delete();
    if(!message.member.hasPermission("BAN_MEMBERS")) return errors.noPerms(message, "BAN_MEMBERS");
    if(args[0] == "help"){
      message.reply("Использование: !ban <юзер> <причина>").then(msg => {msg.delete(5000)});
      return;
    }
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return errors.cantfindUser(message.channel);
    if(bUser.id === bot.user.id) return errors.botuser(message);
    let bReason = args.join(" ").slice(22);
    if(!bReason) return errors.noReason(message.channel);
    if(bUser.hasPermission("MANAGE_MESSAGES")) return errors.equalPerms(message, bUser, "MANAGE_MESSAGES");

    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#bc0000")
    .addField("Забанен", `${bUser} с ID ${bUser.id}`)
    .addField("Забанил", `<@${message.author.id}> с ID ${message.author.id}`)
    .addField("Забанен в", message.channel)
    .addField("Время", message.createdAt)
    .addField("Причина", bReason);

    let incidentchannel = message.guild.channels.find(c => c.name === 'logs');
    if(!incidentchannel) return message.channel.send("Не найден канал.").then(msg => {msg.delete(5000)});

    message.guild.member(bUser).ban(bReason);
    incidentchannel.send(banEmbed);
}

module.exports.help = {
  name:"ban",
  usage: "<@member> <причина>",
  desc: "Забанить человека",
  group: "mod"
}
