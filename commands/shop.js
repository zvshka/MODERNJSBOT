const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const fs = require('fs')
const items = JSON.parse(fs.readFileSync('./utils/items.json', 'utf8'))
const db = require('mongoose')
const user = require('../models/user.js')
db.connect(process.env.DB, {
  useNewUrlParser: true
})

module.exports.run = (bot, message, args) => {
  console.log(message, message.content)
  if (!args.join(" ")) {
    let categories = []
    for (var i in items) {
      if (!categories.includes(items[i].type)) {
        categories.push(items[i].type)
      }
    }
    const embed = new Discord.RichEmbed()
      .setDescription(`Доступно для покупки`)
      .setColor(`BLURPLE`)
    for (var i = 0; i < categories.length; i++) {
      let tempdesc = ''
      for (var c in items) {
        if (categories[i] === items[c].type) {
          tempdesc += `${items[c].name} - $${items[c].price} - ${items[c].desc}\n`
        }
      }
      embed.addField(categories[i], tempdesc)
    }
    message.channel.send(embed)
  } else {
    let itemName = '';
    let itemPrice = 0;

    for (var i in items) {
      console.log(items[i], items)
      if (args.join(' ').trim().toLowerCase() === items[i].name.toLowerCase()) {
        itemName = items[i].name
        itemPrice = items[i].price
      }
    }
    if (itemName === '') {
      return message.channel.send(`Не найдено: ${args.join(' ').trim()}`)
    }
    user.findOne({
      ServerID: message.guild.id,
      UserID: message.author.id
    }, (err, data) => {
      if (err) console.log(err);
      if (!data) {
        const newData = new user({
          UserID: message.author.id,
          ServerID: message.guild.id,
          Money: 0,
          Warns: 0
        })
        newData.save().catch(err => console.log(err))
        message.channel.send('**Проверьте баланс**').then(msg => msg.delete(5000))
      } else {
        if (data.Money < itemPrice) return message.channel.send('**Проверьте баланс**').then(msg => msg.delete(5000));
        data.Money -= itemPrice
        data.save().catch(err => console.log(err))
        message.channel.send(`**Вы купили ${args.join(' ').trim()}**`)
      }
    })

  }
}
module.exports.help = {
  name: "shop",
  usage: " ",
  desc: " ",
  group: "fun"
}