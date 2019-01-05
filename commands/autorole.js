const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const fs = require('fs')
const db = require('mongoose')
const Options = require('../models/servOpt.js')
db.connect(process.env.DB, {
    useNewUrlParser: true
})
module.exports.run = (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return errors.noPerms(message, "ADMINISTRATOR")
    if (!args[0]) {
        message.channel.send({
            embed: {
                fields: [{
                    name: "Успех",
                    value: (`Установлена стандартная автороль Гость`)
                }]
            }
        })
        Options.findOne({
            ServerID: message.guild.id
        }, (err, opts) => {
            if (err) {
                console.log(err.stack)
            }
            opts.AutoRole = "Гость"
            opts.save().catch(err => console.log(err.stack))
        })
    }

    if (args[0] === 'on') {
        let roles = args.join(" ").slice(3)
        let role = message.guild.roles.find(r => r.name === roles)
        if (role) {
            message.channel.send({
                embed: {
                    fields: [{
                        name: "Успех",
                        value: (`Установлена автороль: ${roles}`)
                    }]
                }
            })
            Options.findOne({
                ServerID: message.guild.id
            }, (err, opts) => {
                if (err) {
                    console.log(err.stack)
                }
                opts.AutoRole = role.name
                opts.save().catch(err => console.log(err.stack))
            })
        } else {
            return message.channel.send({
                embed: {
                    fields: [{
                        name: "**Error**",
                        value: "На сервере нет такой роли"
                    }]
                }
            })
        }
    }

    if (args[0] === 'off') {

        message.channel.send({
            embed: {
                fields: [{
                    name: "Успех",
                    value: (`Автороль удалена`)
                }]
            }
        })
        Options.findOne({
            ServerID: message.guild.id
        }, (err, opts) => {
            if (err) {
                console.log(err.stack)
            }
            opts.AutoRole = "off"
            opts.save().catch(err => console.log(err.stack))
        })
    }
}


module.exports.help = {
    name: "autorole",
    usage: "<on/off> <роль>",
    desc: "автороль",
    group: "mod"
}