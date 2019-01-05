const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const fs = require('fs')


module.exports.run = (bot, message, args) => {
    let pages = [
        '**Вопрос 0**\n' +
        'Чтобы узнать ответ напиши в чат: вопрос №вопроса (например вопрос 1)\n' +
        '**Вопрос 1**\n' +
        'Меня загриферели что делать?\n' +
        '**Вопрос 2**\n' +
        'У меня проблемы с привелегией что делать?\n' +
        '**Вопрос 3**\n' +
        'Не зачислился донат что делать?\n',
        '**Вопрос 4**\n' +
        'Меня модератор/хелпер обижает что делать?\n' +
        '**Вопрос 5**\n' +
        'Пропали вещи, помоги что делать?\n' +
        '**Вопрос 6**\n' +
        'Когда был последний вайп?\n',
        '**Вопрос 7**\n' + 
        'Как забрать предмет из онлайн-магазина?\n' +
        '**Вопрос 8**\n' +
        'Почему крафты такие сложные!\n' +
        '**Вопрос 9**\n' +
        'Как стать хелпером?\n' +
        '**Вопрос 10**\n' +
        'Дадут ли мне креатив или админку?\n',
    ]
    let answers = [
        "**Пиши администрации и иди на форум**",
        "**Создавай тему на форуме и вскоре мы её решим**",
        "**Пиши основателю серевера и прикрепи чек зачисления средств**",
        "**Напиши жалобу на форум, а дальше мы разьерёмся**",
        "**Не паникуй, сообщи об этом на форум и жди пока мы не отпишем или поможем**",
        "**На данном проекте фактически нет такого понятия как вайп**",
        "**Пропиши команду /store**",
        "**Потому что на сервере действует усложнение**",
        "**Напиши на форум когда начётся набор и надейся что ты нам подойдёшь**",
        "**Нет. Для начала стань хелпером, а потом уже вырасти до админа**"
    ]
    let page = 1

    const embed = new Discord.RichEmbed()
        .setColor(0xffcc00)
        .setFooter(`Страница ${page} из ${pages.length}`)
        .setDescription(pages[page - 1])
    message.channel.send(embed).then(msg => {
        msg.react("⏪").then(r => {
            msg.react("⏩")
            const backwardsFilter = (reaction, user) => reaction.emoji.name === "⏪" && user.id === message.author.id
            const forwardsFilter = (reaction, user) => reaction.emoji.name === "⏩" && user.id === message.author.id
            const backwards = msg.createReactionCollector(backwardsFilter, {
                time: 60000
            })
            const forwards = msg.createReactionCollector(forwardsFilter, {
                time: 60000
            })
            backwards.on('collect', r => {
                if (page === 1) return;
                page--
                embed.setDescription(pages[page - 1])
                embed.setFooter(`Страница ${page} из ${pages.length}`)
                msg.edit(embed)
            })
            forwards.on('collect', r => {
                if (page === pages.length) return;
                page++
                embed.setDescription(pages[page - 1])
                embed.setFooter(`Страница ${page} из ${pages.length}`)
                msg.edit(embed)
            })
        })
        msg.delete(60000)
    }).then(msg => {
        const ansemed = new Discord.RichEmbed()
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 60000
        });
        collector.on('collect', message => {
            for (var i = 0; i <= answers.length; i++) {
                if (message.content.toLowerCase() === `вопрос ${i}`) {
                  message.delete()  
                  message.channel.send(`${answers[i - 1]}`).then(msg => msg.delete(5000))
                }
            }
        })
    })
}

module.exports.help = {
    name: "qs",
    usage: " ",
    desc: "Частые вопросы",
    group: "other"
}