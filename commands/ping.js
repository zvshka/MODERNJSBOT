const Discord = require('discord.js')

module.exports.run = async (bot, message, args, color) => {

    let start = Date.now(); message.channel.send(message.channel.id).then(message => { 
    let diff = (Date.now() - start); 
    let API = (bot.ping).toFixed(2)
        
        let embed = new Discord.RichEmbed()
        .setTitle(`🔔 Pong!`)
        .setColor(0x6af29a)
        .addField("📶 Latency", `${diff}ms`, true)
        .addField("💻 API", `${API}ms`, true)
        message.edit(embed);
      
    });

}

module.exports.help = {
    name: 'ping',
    usage: " ",
    desc: "пинг до бота",
    group: "mod"
}