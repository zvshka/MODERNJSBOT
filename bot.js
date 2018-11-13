//Вызов пакетов
const botconfig = require("./utils/botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const join = require('./utils/memberJoined')
const leave = require('./utils/memberLeaved')
const kick = require('./utils/memberKicked')
const ban = require('./utils/memberBanned')
const guildAdd = require('./utils/onGuildAdd')
const enves = require('dotenv').config({
  path: './.env'
})
let cooldown = new Set();
let cdseconds = 5;
const db = require('mongoose')
const Coins = require('./models/coins.js')
const Options = require('./models/servOpt.js')

var prefix = ""

//Считывание папки с командами
fs.readdir("./commands/", (err, files) => {

  //if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("не найдены команды.");
    return;
  }

  jsfile.forEach((f, i) => {
    var help = JSON.parse(fs.readFileSync("./utils/help.json", "utf8"))
    let props = require(`./commands/${f}`);
    console.log(`${f} загружено!`);
    bot.commands.set(props.help.name, props);
    help[props.help.name] = {
      name: props.help.name,
      usage: props.help.usage,
      desc: props.help.desc,
      group: props.help.group
    }

    fs.writeFileSync("./utils/help.json", JSON.stringify(help), (err) => {
      if (err) {
        console.log(err)
      }
    })
  });

});

bot.on("ready", () => {
  console.log(`Дата: ${Date()}; ${bot.user.username} онлайн на ${bot.guilds.size} серверах!`);
  bot.user.setPresence({
    game: {
      name: 'twitch.tv/zvshka',
      type: 'STREAMING',
      url: 'https://www.twitch.tv/zvshka'
    },
    status: 'dnd'
  })
});

bot.on("ready", () => {
  let serverdb = db.connect(process.env.SERVERSDB, {
    useNewUrlParser: true
  }).then(res => {
    bot.guilds.forEach((guild) => {
      Options.findOne({
        ServerID: guild.id
      }, (err, opts) => {
        if (err) {
          console.log(err.stack)
        }
        if (!opts) {
          const newGuild = new Options({
            ServerID: guild.id,
            Prefix: "!",
            AutoRole: "off"
          })
          newGuild.save().catch(err => console.log(err.stack))
          try {
            guild.members.get(bot.user.id).setNickname(`[${newGuild.Prefix}] ${guild.members.get(bot.user.id).displayName.slice(4)}`)
          } catch (e) {
            console.log(e.stack)
          }
        } else {
          try {
            guild.members.get(bot.user.id).setNickname(`[${opts.Prefix}] ${guild.members.get(bot.user.id).displayName.slice(4)}`)
          } catch (e) {
            console.log(e.stack)
          }
        }
      })
    })
  })
})

//Исполнение команд
bot.on("message", msg => {
  //Проверка на то что создатель сообщения бот и канал DM
  if (msg.author.bot) return
  if (msg.channel.type === "dm") return;

  let msgcontent = msg.content
  //Монетки :D

  let messageArray = msgcontent.split(" ");
  console.log(messageArray, msg.content,)
  let cmd = messageArray[0].toLocaleLowerCase();
  let args = messageArray.slice(1);

  msg.guild.fetchMember(msg.author).then(m => console.log(`[log]${msg.guild.name}: ${m.displayName}: ${msg}`))

  function cmdrun(prefix) {
    if (!msg.content.startsWith(prefix)) return;
    if (cooldown.has(msg.author.id)) {
      msg.delete();
      return msg.reply("Подожди 5 секунд.")
    }
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      cooldown.add(msg.author.id);
    }

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
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
        } catch(e) {
          console.log(err)
        }
      }
    })
  })

});
//Выдача роли когда кто-то вступает и приветствие
bot.on('guildMemberAdd', (member) => {
  try {
    join.process(bot, member);
  } catch (e) {
    console.error(e.stack);
  }

  let serverdb = db.connect(process.env.SERVERSDB, {
    useNewUrlParser: true
  }).then(res => {
    Options.findOne({
      ServerID: message.guild.id
    }, (err, opts) => {
      let role = member.guild.roles.find(r => r.name === opts.AutoRole)

      if (!role) return;

      member.addRole(role)
    })
  })

});

bot.on('guildMemberRemove', (member) => {
  try {
    kick.process(bot, member)
  } catch (e) {
    console.error(e.stack);
  }

  try {
    ban.process(bot, member)
  } catch (e) {
    console.error(e.stack);
  }

  try {
    leave.process(bot, member)
  } catch (e) {
    console.error(e.stack);
  }

})

bot.on('guildCreate', (guild) => {
  try {
    guildAdd.process(bot, guild)
  } catch (e) {
    console.log(e.stack)
  }
})
//Логин
bot.login(process.env.TOKEN)