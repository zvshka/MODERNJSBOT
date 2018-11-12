const Discord = require('discord.js');

module.exports = {
  process: (bot, GuildMember) => {
    const User = GuildMember.user;
    const userLogsChannel = GuildMember.guild.channels.find(c => c.name === 'welcome');
    if (userLogsChannel) {
      userLogsChannel.send(
        ':white_check_mark: ' +
        User.toString() + ' ' +
        '(' + User.username + ') ' +
        '`' + User.id + '` Покинул нас ' +
        new Date().toUTCString()
      );
    }
  }
};