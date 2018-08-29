const Discord = require('discord.js');
const moment = require('moment');

module.exports.run = (bot, message, args) => {

  let target = message.guild.member(message.mentions.users.first());
  if (!target) {
    target = message.member;
  }

  const embed = new Discord.RichEmbed();
  embed.setColor(0x3398DB);

  embed.setTitle(
    target.displayName +
    ' вступил ' +
    moment(target.joinedAt).fromNow()
  );

  embed.setAuthor(
    target.displayName,
    target.user.avatarURL,
    ''
  );

  embed.addField('Пользователь:', target, true);
  embed.addField('Запросил:', message.author, true);
  embed.addField('Дата:', target.joinedAt, true);

  message.channel.send(
    'Здесь\' ' +
    target +
    '\' вступил, Благодаря ' +
    message.author, {
      embed: embed
    }
  );
}

module.exports.help = {
  name: "when",
  usage: "[member]",
  desc: "когда вступил",
  group: "fun"
}