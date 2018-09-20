const Discord = require('discord.js');

module.exports = {
    process: (bot, GuildMember) => {
        let logs = GuildMember.guild.channels.find(c => c.name === 'logs');
        if (!logs) return;
        let date = Date.now()
        const entry = GuildMember.guild.fetchAuditLogs({
            type: 'MEMBER_KICK'
        })
        .then(audit => audit.entries.first())
        .then(entry => {
            if(!entry.executor.bot) {
                let date_m = date - entry.createdTimestamp
                console.log(date_m)
                if (date_m < 3000) {
                let kickEmbed = new Discord.RichEmbed()
                .setDescription("~Kick~")
                .setColor("#e56b00")
                .addField("Кикнут", `<@${entry.target.id}> с ID ${entry.target.id}`)
                .addField("Кикнул", `<@${entry.executor.id}> с ID ${entry.executor.id}`)
                .addField("Кикнут в", "NaN")
                .addField("Время", `${entry.createdAt}`)
                .addField("Причина", `${entry.reason}`)
                logs.send(kickEmbed)
                }
            }
            console.log(entry)
        })
        
    }

};