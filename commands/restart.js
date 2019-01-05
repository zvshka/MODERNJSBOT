const Discord = require('discord.js')

module.exports.run = (bot, message, args, color) => {

 if (!message.member.id === '474882638986084352') return message.reply("Нет.");

 message.react('✅').then(message => bot.destroy()).then(() => bot.login(process.env.TOKEN));

}

module.exports.help = {
    name: "restart",
    usage: " ",
    desc: " ",
    group: "mod"
}