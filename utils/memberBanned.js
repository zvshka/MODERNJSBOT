const Discord = require('discord.js');

module.exports = {
    process: (bot, GuildMember) => {
        let logs = GuildMember.guild.channels.find(c => c.name === 'logs');
        if (!logs) return;
        let date = Date.now()
        const entry = GuildMember.guild.fetchAuditLogs({
                type: 'MEMBER_BAN_ADD'
            })
            .then(audit => audit.entries.first())
            .then(entry => {
                if (!entry.executor.bot) {
                    let date_m = date - entry.createdTimestamp
                    console.log(date_m)
                    if (date_m < 3000) {
                        let banEmbed = new Discord.RichEmbed()
                            .setDescription("~Ban~")
                            .setColor("#bc0000")
                            .addField("Забанен", `<@${entry.target.id}> с ID ${entry.target.id}`)
                            .addField("Забанил", `<@${entry.executor.id}> с ID ${entry.executor.id}`)
                            .addField("Забанен в", "NaN")
                            .addField("Время", entry.createdAt)
                            .addField("Причина", entry.reason);
                        logs.send(banEmbed)
                    }
                }
            })

    }

};