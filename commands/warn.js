const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const errors = require('../utils/errors')
const fetch = require('node-fetch')

module.exports.run = async (bot, message, args) => {
  let warns = JSON.parse(fs.readFileSync("./utils/warnings.json", "utf8"));
  if (!message.member.hasPermission("ADMINISTRATOR")) return errors.noPerms(message, "ADMINISTRATOR").then(msg => {
    msg.delete(5000)
  });

  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])

  if (!wUser) return message.channel.send({
    embed: {
      color: 0x00a8ff,
      description: "Не указан человек"
    }
  });
  if (wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("They waaaay too kewl").then(msg => {
    msg.delete(5000)
  });

  let reason = args.join(" ").slice(22);
  if (!reason) return message.channel.send({
    embed: {
      color: 0x00a8ff,
      description: "Причина не указана"
    }
  })

  if (!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };

  warns[wUser.id].warns++;

  fs.writeFile("./utils/warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });
   
  fetch(`${process.env.WARNS_URL}`,  { 
    method: 'PUT',
    body:    JSON.stringify(warns),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res => res.json())
  .then(json => console.log(json))
  let warnEmbed = new Discord.RichEmbed()
    .setDescription("Warns")
    .setAuthor(message.author.username)
    .setColor("#fc6400")
    .addField("Заварнен", `<@${wUser.id}>`)
    .addField("Заварнен в", message.channel)
    .addField("Варнов", warns[wUser.id].warns)
    .addField("Причина", reason)
    .setFooter(`${message.author.username}`, message.author.avatarURL)
  let warnchannel = message.guild.channels.find(c => c.name === "logs");
  if (!warnchannel) return message.reply("Канал не найден").then(msg => {
    msg.delete(5000)
  });

  message.delete()
  warnchannel.send(warnEmbed);

  if (warns[wUser.id].warns == 4) {
    let muterole = message.guild.roles.find(r => r.name === "BGuy");
    if (!muterole) return message.reply("Нет роли.");

    let mutetime = "10s";
    await (wUser.addRole(muterole.id));
    message.channel.send(`<@${wUser.id}> Замучен`);

    setTimeout(function () {
      wUser.removeRole(muterole.id)
      message.reply(`<@${wUser.id}> Размучен.`)
    }, ms(mutetime))
  }
  if (warns[wUser.id].warns == 10) {
    message.guild.member(wUser).ban(reason);
    message.reply(`<@${wUser.id}> Забанен.`)
  }
}

module.exports.help = {
  name: "warn"
}
