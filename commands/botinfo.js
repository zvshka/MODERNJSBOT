const Discord = require("discord.js");

module.exports.run =   (bot, message, args) => {
    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Информация о боте")
    .setColor("#15f153")
    .setThumbnail(bicon)
    .addField("Имя", bot.user.username)
    .addField("Создан", bot.user.createdAt);

    message.channel.send(botembed).then(msg => {msg.delete(5000)});
}

module.exports.help = {
  name:"botinfo"
}
