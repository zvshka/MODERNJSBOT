const botconfig = require("./utils/botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
const join = require('./utils/memberJoined')
const leave = require('./utils/memberLeaved')
const bk = require('./utils/memberBanned')
const guildAdd = require('./utils/onGuildAdd')
const enves = require('dotenv').config({
  path: './.env'
})
let cooldown = new Set();
let cdseconds = 5;
const db = require('mongoose')
const Coins = require('./models/coins')
const Options = require('./models/servOpt')

bot.on('message', msg => {
  if (msg.author.bot) return
  if (msg.channel.type === "dm") return;

  function cmdrun(prefix) {
    if (!msg.content.startsWith(prefix)) return;
    if (cooldown.has(msg.author.id)) {
      msg.delete();
      return msg.reply("Подожди 5 секунд.")
    }
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      cooldown.add(msg.author.id);
    }
    let args = msg.content.slice(prefix.length).trim().split(' ')
    console.log(args)
    let cmd = args.shift().toLowerCase();
    try {
      let commandfile = require(`./commands/${cmd}`)
      if (commandfile) {
        commandfile.run(bot, msg, args);
      } else {
        let coinAmt = Math.floor(Math.random() * 10) + 100;
        let baseAmt = Math.floor(Math.random() * 10) + 100;
        if (coinAmt === baseAmt) {
          let userdb = db.connect(process.env.USERSDB, {
            useNewUrlParser: true
          }).then(res => {
            Coins.findOne({
              UserID: msg.author.id,
              ServerID: msg.guild.id,
            }, (err, money) => {
              if (err) {
                console.log(err)
              }
              if (!money) {
                const newMoney = new Coins({
                  UserID: msg.author.id,
                  ServerID: msg.guild.id,
                  money: coinAmt,
                })
                newMoney.save().catch(err => console.log(err.stack))
              } else {
                money.money += coinAmt
                money.save().catch(err => console.log(err.stack))
              }
            })
          })

          let coinEmbed = new Discord.RichEmbed()
            .setAuthor(msg.author.username)
            .setColor("#3de2fa")
            .addField("💸", `${coinAmt} монет добавлено!`);

          msg.channel.send(coinEmbed).then(msg => {
            msg.delete(5000)
          });
        }
      }

      setTimeout(() => {
        cooldown.delete(msg.author.id)
      }, cdseconds * 1000)

    } catch (err) {
      console.log(err)
    }
  }
  //Опять префикс
  let serverdb = db.connect(process.env.SERVERSDB, {
    useNewUrlParser: true
  }).then(res => {
    Options.findOne({
      ServerID: msg.guild.id
    }, (err, opts) => {
      if (err) {
        console.log(err.stack)
      }
      if (!opts) {
        const newOpts = new Options({
          ServerID: msg.guild.id,
          Prefix: botconfig.prefix,
          AutoRole: "off"
        })
        newOpts.save().catch(err => console.log(err.stack))
        cmdrun(newOpts.Prefix)
      } else {
        try {
          cmdrun(opts.Prefix)
        } catch (e) {
          console.log(err)
        }
      }
    })
  })

})

bot.login(process.env.TOKEN)