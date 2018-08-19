const Discord = require("discord.js");

module.exports.run =   (bot, message, args) => {
    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("О сервере")
    .setColor("#15f153")
    .setThumbnail(sicon)
    .addField("Имя", message.guild.name)
    .addField("Создан", message.guild.createdAt)
    .addField("Вы вступили", message.member.joinedAt)
    .addField("Всего участников", message.guild.memberCount);

    message.channel.send(serverembed).then(msg => {msg.delete(5000)});
}

module.exports.help = {
  name:"serverinfo"
}
