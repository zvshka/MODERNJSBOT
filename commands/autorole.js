const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const fs = require('fs')
const fetch = require('node-fetch')

module.exports.run = (bot, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return errors.noPerms(message, "ADMINISTRATOR")
    let autorole = JSON.parse(fs.readFileSync('./utils/autoroles.json', 'utf8'))
    if(!args[0]) {
        autorole[message.guild.id] = {
            role: "Гость"
        }
        fs.writeFile('./utils/autoroles.json', JSON.stringify(autorole), (err) =>{
            if(err) console.log(err)
        })
        
        fetch(`${process.env.ROLES_URL}`,  { 
            method: 'PUT',
            body:    JSON.stringify(autorole),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(json => console.log(json))
        message.channel.send({embed:{
            fields: [{
                name: "Успех",
                value: (`Установлена стандартная автороль Гость`)
            }]
        }})
    
    }
    
    if(args[0] === 'on') {
        let rolees = args.join(" ").slice(3)
        let role = message.guild.roles.find("name", rolees)
        autorole[message.guild.id] = {
            role: role.name
        }
        fs.writeFile('./utils/autoroles.json', JSON.stringify(autorole), (err) =>{
            if(err) console.log(err)
        })
        fetch(`${process.env.ROLES_URL}`,  { 
            method: 'PUT',
            body:    JSON.stringify(autorole),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(json => console.log(json))
        message.channel.send({embed:{
            fields: [{
                name: "Успех",
                value: (`Установлена автороль: ${rolees}`)
            }]
        }})
    }
    
    if(args[0] === 'off') {
        delete autorole[message.guild.id]
        fs.writeFile('./utils/autoroles.json', JSON.stringify(autorole), (err) =>{
            if(err) console.log(err)
        })
        fetch(`${process.env.ROLES_URL}`,  { 
            method: 'PUT',
            body:    JSON.stringify(autorole),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(json => console.log(json))
        message.channel.send({embed:{
            fields: [{
                name: "Успех",
                value: (`Автороль удалена`)
            }]
        }})
    }
    //    if(!autorole) guid.createRole({
    //        name: ``
    //    })
}


module.exports.help = {
    name: "autorole"
}