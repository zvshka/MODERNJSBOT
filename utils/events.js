const Discord = require('discord.js');
const db = require('mongoose')
const Options = require('../models/servOpt.js')
db.connect(process.env.DB, {
    useNewUrlParser: true
})

module.exports.bane = {

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
                    let ndate = date - entry.createdTimestamp
                    if (ndate < 3000) {
                        let banEmbed = new Discord.RichEmbed()
                            .setDescription(`**Ban**: ${entry.target.username}#${entry.target.discriminator}`)
                            .setColor("#bc0000")
                            .addField("Забанен", `<@${entry.target.id}> с ID ${entry.target.id}`)
                            .addField("Забанил", `<@${entry.executor.id}> с ID ${entry.executor.id}`)
                            .addField("Время", entry.createdAt)
                            .addField("Причина", entry.reason);
                        logs.send(banEmbed)
                    }
                }
            })

    }

}

module.exports.kicke = {

    process: (bot, GuildMember) => {
        let logs = GuildMember.guild.channels.find(c => c.name === 'logs');
        if (!logs) return;
        let date = Date.now()
        const entry = GuildMember.guild.fetchAuditLogs({
                type: 'MEMBER_KICK'
            })
            .then(audit => audit.entries.first())
            .then(entry => {
                if (!entry.executor.bot) {
                    let ndate = date - entry.createdTimestamp
                    if (ndate < 3000) {
                        let kickEmbed = new Discord.RichEmbed()
                            .setDescription(`**Kick**: ${entry.target.username}#${entry.target.discriminator}`)
                            .setColor("#e56b00")
                            .addField("Кикнут", `<@${entry.target.id}> с ID ${entry.target.id}`)
                            .addField("Кикнул", `<@${entry.executor.id}> с ID ${entry.executor.id}`)
                            .addField("Время", `${entry.createdAt}`)
                            .addField("Причина", `${entry.reason}`)
                        logs.send(kickEmbed)
                    }
                }

            })

    }

}

module.exports.joine = {
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

        if (User.bot) return;
        GuildMember.send({
            embed: embed
        });
    }
}

module.exports.guildadd = {
    process: (bot, guild) => {
        Options.findOne({
            ServerID: guild.id
        }, (err, opts) => {
            if (err) {
                console.log(err.stack)
            }
            if (!opts) {
                const newOpts = new Options({
                    ServerID: guild.id,
                    Prefix: "!",
                    AutoRole: "off"
                })
                newOpts.save().catch(err => console.log(err.stack))
            }
        })
    }
}

module.exports.leavee = {
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
}