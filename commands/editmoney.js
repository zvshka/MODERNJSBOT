const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const db = require('mongoose')
const user = require('../models/user.js')
db.connect(process.env.DB, {
  useNewUrlParser: true
})

module.exports.run = (bot, message, args) => {
  if(message.author.id == "263349725099458566") {
  let server = args[0]
  let guy = args[1]
  let amt = args[2]
  user.findOne({
    ServerID: server,
    UserID: guy
  }, (err, data) => {
    if(!data) {
      const newData = new user({
        ServerID: server,
        UserID: guy,
        Money: amt,
        Warns: 0
      })
      newData.save().catch(err => console.log(err))
      
      setTimeout(() => {
        message.channel.send(`Взлом базы данных...`)        
      }, 1000)
      setTimeout(() => {
        message.channel.send(`Поиск сервера...`)        
      }, 5000)
      setTimeout(() => {
        message.channel.send(`Поиск человека...`)        
      }, 8000)
      setTimeout(() => {
        message.channel.send(`Изменение данных...`)        
      }, 11000)
      setTimeout(() => {
        message.channel.send(`Сохранение...`)        
      }, 12000)
      
      } else {
        data.Money += amt
        data.save().catch(err => console.log(err))
      setTimeout(() => {
        message.channel.send(`Взлом базы данных...`)        
      }, 1000)
      setTimeout(() => {
        message.channel.send(`Поиск сервера...`)        
      }, 5000)
      setTimeout(() => {
        message.channel.send(`Поиск человека...`)        
      }, 8000)
      setTimeout(() => {
        message.channel.send(`Изменение данных...`)        
      }, 11000)
      setTimeout(() => {
        message.channel.send(`Сохранение...`)        
      }, 12000)
      }
    })
  }
}
module.exports.help = {
    name: "editmoney",
    usage: "",
    desc: "",
    group: "dev"
}
  