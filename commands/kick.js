const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {

    if(!message.member.hasPermission("KICK_MEMBERS")) return errors.noPerms(message, "KICK_MEMBERS");
    if(args[0] == "help"){
      message.reply("Использование: !kick <юзер> <причина>").then(msg => {msg.delete(5000)});
      return;
    }
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return errors.cantfindUser(message.channel);
    let kReason = args.join(" ").slice(22);
    if(kUser.hasPermission("MANAGE_MESSAGES")) return errors.equalPerms(message, kUser, "MANAGE_MESSAGES");

    let kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor("#e56b00")
    .addField("Кикнут", `${kUser} с ID ${kUser.id}`)
    .addField("Кикнул", `<@${message.author.id}> с ID ${message.author.id}`)
    .addField("Кикнут в", message.channel)
    .addField("Время", message.createdAt)
    .addField("Причина", kReason);

    let kickChannel = message.guild.channels.find(c => c.name === 'logs');
    if(!kickChannel) return message.channel.send("Не найден канал.").then(msg => {msg.delete(5000)});

    message.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);
}

module.exports.help = {
  name:"kick",
  usage: "<@member> <причина>",
  desc: "кик",
  group: "mod"
}
