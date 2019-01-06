const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const fs = require('fs')
module.exports.run = (bot, message, args) => {
    let adembed = new Discord.RichEmbed()
    let adroles = message.guild.roles.array()
    let admember = message.guild.members.array()
    for (let i in admember) {
        for (let j in adroles) {
            if (adroles[j].name === "Administrator") {
                if (admember[i].roles.has(adroles[j].id)) {
                    console.log(admember[i])
                    adembed.addField(`Administrator`, `<@${admember[i].id}>`)
                }
            }
        
            if (adroles[j].name === "Moderator") {
                if (admember[i].roles.has(adroles[j].id)) {
                    console.log(admember[i])
                    adembed.addField(`Moderator`, `<@${admember[i].id}>`)
                }

            }
        }
    }
    message.channel.send(adembed)
}
module.exports.help = {
    name: "adms",
    usage: " ",
    desc: "показывает администраторов",
    group: "mod"
}