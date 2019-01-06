const {
    RichEmbed
} = require("discord.js");

module.exports.run = (bot, message, args) => {

    if(args[0].toLowerCase() == 'add') {
        message.delete()
        let target = args.join(' ').slice(4).trim().split('\n')
        const embed = new RichEmbed()
        .color('BLURPLE')
        .addField('**Quest**', `**Цель**:${target[0]}\n **Описание**:${target[1]}`)
        message.channel.send(embed)
    }
}

module.exports.help = {
    name: "quest",
    usage: " ",
    desc: "Квесты в результате которых ты получишь очки лояльности",
    group: "mod"
}