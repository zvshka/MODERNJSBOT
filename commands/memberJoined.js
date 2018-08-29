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

    const description = 'Молодец что вступил к нам!\n\n' + 
      'Если что то надо зови "создателей и тп".\n\n' + 
      'Правила\n\n'+
      '1. Общаться только в строго определённых каналах\n\n'+
      '2. Быть онлайн хотябы раз в 14 дней если нет возможности то сообщить администарции\n\n'+
      '3. Не оскорблять товарищей по игре\n\n'+
      '4. Если вы гость то вы можете оставить заявку в клан в опр канале\n\n'+
      `Остальное в канале rules`
    
    embed.setTitle('Добро пожаловть в CIL!');
    embed.setDescription(description);
    embed.setFooter('CIL', GuildMember.guild.iconURL);
    
    if(User.bot) return
    GuildMember.send({ embed: embed });
  }
};  

module.exports.help = {
  name: "onjoin",
  usage: " ",
  desc: " ",
  group: "mod"
}