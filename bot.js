const botconfig = require("./utils/botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
const join = require('./utils/memberJoined')
const leave = require('./utils/memberLeaved')
//const bk = require('./dev/memberBanned')
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

  function coins(a, aid, gid) {
    let coinAmt = Math.floor(Math.random() * 10) + 100;
    let baseAmt = Math.floor(Math.random() * 10) + 100;
    if (coinAmt === baseAmt) {
      let userdb = db.connect(process.env.USERSDB, {
        useNewUrlParser: true
      }).then(res => {
        Coins.findOne({
          UserID: aid,
          ServerID: gid,
        }, (err, money) => {
          if (err) {
            console.log(err)
          }
          if (!money) {
            const newMoney = new Coins({
              UserID: aid,
              ServerID: gid,
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
        .setAuthor(a.username)
        .setColor("#3de2fa")
        .addField("💸", `${coinAmt} монет добавлено!`);

      msg.channel.send(coinEmbed).then(msg => {
        msg.delete(5000)
      });
    }

  }

  function cmdrun(prefix) {
    if (!msg.content.startsWith(prefix)) return;
    try {
      var args = msg.content.slice(prefix.length).trim().split(/ +/g);
    } catch (e) {
      if (e) {
        console.log(e.stack)
      }
    }
    let cmd = args.shift().toLowerCase()
    let commandfile = require(`./commands/${cmd}`)
    if (commandfile) {
      commandfile.run(bot, msg, args);
      setTimeout(() => {
        cooldown.delete(msg.author.id)
      }, cdseconds * 1000)

    } else {
      coins(msg.author, msg.author.id, msg.guild.id)
    }
  }

  if (msg.author.bot) return
  if (msg.channel.type === "dm") return;
  if (cooldown.has(msg.author.id)) {
    msg.delete();
    return msg.reply("Подожди 5 секунд.")
  }
  if (!msg.member.hasPermission("ADMINISTRATOR")) {
    cooldown.add(msg.author.id);
  }
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

        cmdrun(opts.Prefix)

      }
    })
  })

})

bot.login(process.env.TOKEN)