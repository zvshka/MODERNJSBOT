const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const fs = require('fs')
const ms = require('ms')

module.exports.run = async (bot, message, args) => {
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return errors.noPerms(message, "ADMINISTRATOR");
    if (message.author.id == "424187941007654924") return message.channel.send("А разрешение спросить?");
    let tolock = message.guild.member(message.mentions.users.first())
    let roles = []
    let muterole = message.guild.roles.find(r => r.name === "muted");
    let mutetime = args[1];
    if (!mutetime) return message.reply("Не указанно время");
    if (!muterole) {
        try {
            muterole = await message.guild.createRole({
                name: "muted",
                color: "#000001",
                permissions: []
            })
            message.guild.channels.forEach(async (channel, id) => {
                if (channel.name == 'карцер') return;
                await channel.overwritePermissions(muterole, {
                    SPEAK: false,
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }
    tolock.roles.forEach(role => {
        if (role.name == '@everyone') return;
        roles.push(role.id)
        tolock.removeRole(role.id)
    });
    console.log(roles)
    await tolock.addRole(muterole.id)
    await message.channel.send(`${tolock} залочен на ${args[1]}`)
    setTimeout(() => {
        tolock.removeRole(muterole.id);
        roles.forEach(id => {
            tolock.addRole(id)
        })
        message.channel.send(`<@${tolock.id}> разлочен!`);
    }, ms(mutetime));
}

module.exports.help = {
    name: "lock",
    usage: " ",
    desc: " ",
    group: "mod"
}