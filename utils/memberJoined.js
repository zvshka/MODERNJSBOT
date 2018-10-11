const Discord = require('discord.js');

module.exports = {
  process: (bot, GuildMember) => {
    const User = GuildMember.user;
    const userLogsChannel = GuildMember.guild.channels.find(c => c.name === 'welcome');

    userLogsChannel.send(
      ':white_check_mark: ' +
      User.toString() + ' ' +
      '(' + User.username + ') ' +
      '`' + User.id + '` Присоединился ' +
      new Date().toUTCString()
    );

    // DM the user more onboarding information
    const embed = new Discord.RichEmbed();

    const description = `Читай правила и тп в канале https://discord.gg/R5xcAvy`

    embed.setTitle('Добро пожаловть в CIL!');
    embed.setDescription(description);
    embed.setFooter('C.I.L', GuildMember.guild.iconURL);
    
    if(User.bot) return
    GuildMember.send({ embed: embed });
  }
};  