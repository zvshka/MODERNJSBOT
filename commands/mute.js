const errors = require("../utils/errors.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
    let tomute = message.guild.member(message.mentions.users.first());
    if (!tomute) return message.reply("Нет таких.");
    if (tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Нельзя");
    let muterole = message.guild.roles.find(r => r.name === "muted");
    //start of create role
    if (!muterole) {
        try {
            muterole = await message.guild.createRole({
                name: "muted",
                color: "#000001",
                permissions: []
            })
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }
    //end of create role
    let mutetime = args[1];
    if (!mutetime) return message.reply("Не указанно время");

    await (tomute.addRole(muterole.id));
    message.reply(`<@${tomute.id}> замучен ${ms(ms(mutetime))}`);

    setTimeout(() => {
        tomute.removeRole(muterole.id);
        message.channel.send(`<@${tomute.id}> размучен!`);
    }, ms(mutetime));
}

module.exports.help = {
    name: "mute",
    usage: " ",
    desc: " ",
    group: "no"
}