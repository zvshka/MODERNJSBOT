const user = require("../models/user.js")
module.exports.run = (bot, message, args) => {
  //!pay @isatisfied 59345
  let pUser = message.guild.member(message.mentions.users.first());

  if (!pUser) return message.reply(`ничего не указанно`).then(msg => {
    msg.delete(5000)
  });

  if (!args[1]) return message.reply('Не указанно кол-во монет');
  user.findOne({
    ServerID: message.guild.id,
    UserID: message.author.id
  }, (err, data) => {
    if (err) {
      console.log(err)
    }
    if (!data) {
      const newData = new user({
        ServerID: message.guild.id,
        UserID: message.author.id,
        Money: 0,
        Warns: 0
      })
      newData.save().catch(err => console.log(err))
      message.channel.send("**Проверьте баланс**").then(msg => msg.delete(6000))
    } else {
      if (data.Money >= args[1]) {
        data.Money = data.Money - parseInt(args[1])
        data.save().catch(err => console.log(err))
        res()
      } else {
        message.channel.send("**Проверьте баланс**").then(msg => msg.delete(6000))
      }
    }
  })

  function res() {
    user.findOne({
      ServerID: message.guild.id,
      UserID: pUser.id
    }, (err, data) => {
      if (err) {
        console.log(err)
      }
      if (!data) {
        const newData = new user({
          ServerID: message.guild.id,
          UserID: message.author.id,
          Money: parseInt(args[1]),
          Warns: 0
        })
        newData.save().catch(err => console.log(err))
        message.channel.send("**Проверьте баланс**").then(msg => msg.delete(6000))
      } else {
        data.Money = data.Money + parseInt(args[1])
        data.save().catch(err => console.log(err))
        message.channel.send(`**${message.author} передал ${pUser} ${args[1]} монет**`)
      }
    })
  }

}

module.exports.help = {
  name: "pay1",
  usage: "<@member> <кол-во>",
  desc: "отправить монетки кому то",
  group: "fun"
}