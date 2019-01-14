const botconfig = require("./utils/botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
const eventlist = require('./utils/events.js')
const fs = require("fs");
bot.commands = new Discord.Collection();
let cdseconds = 5;
let cooldown = new Set();
const db = require('mongoose')
const user = require('./models/user.js')
const Options = require('./models/servOpt')
db.connect(process.env.DB, {
  useNewUrlParser: true
})

fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on('message', msg => {
  if (msg.author.bot) return;
  let messageArray = msg.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  if(process.env.DEBUG == "true") {
    if (msg.author.id != "263349725099458566") {
      return;
    }
  }
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
      let commandfile = bot.commands.get(cmd.slice((newOpts.Prefix).length));
      if (commandfile) {
        if (cooldown.has(msg.author.id)) {
          msg.delete();
          return msg.reply("You have to wait 5 seconds between commands.")
        }
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
        cooldown.add(msg.author.id);
        }
        setTimeout(() => {
          cooldown.delete(msg.author.id)
        }, cdseconds * 1000)
        commandfile.run(bot, msg, args, newOpts.Prefix)
      } else {
        let coinAmt = Math.floor(Math.random() * 15) + 100;
        let baseAmt = Math.floor(Math.random() * 15) + 100;
        console.log(`${msg.guild.member(msg.author).displayname}, ${coinAmt, baseAmt}`)
        if (coinAmt == baseAmt) {
          user.findOne({
            UserID: msg.author.id,
            ServerID: msg.guild.id
          }, (err, data) => {
            if (err) {
              console.log(err.stack)
            }
            if (!data) {
              const newData = new user({
                UserID: msg.author.id,
                ServerID: msg.guild.id,
                Money: parseInt(coinAmt),
                Warns: 0
              })
              newData.save().catch(err => console.log(err.stack))
              let coinEmbed = new Discord.RichEmbed()
                .setAuthor(msg.author.username)
                .setColor("BLURPLE")
                .addField("💸", `**${coinAmt} добавлено монет!**`);

              msg.channel.send(coinEmbed).then(msg => {
                msg.delete(5000)
              });
            } else {
              data.Money = data.Money + parseInt(coinAmt)
              data.save().catch(err => console.log(err.stack))
              let coinEmbed = new Discord.RichEmbed()
                .setAuthor(msg.author.username)
                .setColor("BLURPLE")
                .addField("💸", `**${coinAmt} добавлено монет!**`);

              msg.channel.send(coinEmbed).then(msg => {
                msg.delete(5000)
              });
            }
          })
        }
      }
    } else {
      let commandfile = bot.commands.get(cmd.slice((opts.Prefix).length));
      if (commandfile) {
        if (cooldown.has(msg.author.id)) {
          msg.delete();
          return msg.reply("You have to wait 5 seconds between commands.")
        }
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
        cooldown.add(msg.author.id);
        }
        setTimeout(() => {
          cooldown.delete(msg.author.id)
        }, cdseconds * 1000)
        commandfile.run(bot, msg, args, opts.Prefix)
      } else {
        let coinAmt = Math.floor(Math.random() * 15) + 100;
        let baseAmt = Math.floor(Math.random() * 15) + 100;
        console.log(`${msg.guild.member(msg.author).displayName}, ${coinAmt}, ${baseAmt}`)
        if (coinAmt == baseAmt) {
          user.findOne({
            UserID: msg.author.id,
            ServerID: msg.guild.id
          }, (err, data) => {
            if (err) {
              console.log(err.stack)
            }
            if (!data) {
              const newData = new user({
                UserID: msg.author.id,
                ServerID: msg.guild.id,
                Money: parseInt(coinAmt),
                Warns: 0
              })
              newData.save().catch(err => console.log(err.stack))
            } else {
              data.Money = data.Money + parseInt(coinAmt)
              data.save().catch(err => console.log(err.stack))
              let coinEmbed = new Discord.RichEmbed()
                .setAuthor(msg.author.username)
                .setColor("BLURPLE")
                .addField("💸", `**${coinAmt} добавлено монет!**`);

              msg.channel.send(coinEmbed).then(msg => {
                msg.delete(5000)
              });
            }
          })
        }
      }
    }
  })
  
})

bot.on('guildBanAdd', (guild, user) => {
  try {
    eventlist.bane.process(bot, user, guild)
  } catch (e) {
    console.error(e.stack);
  }
})

bot.on('guildMemberAdd', (member) => {
  try {
    eventlist.joine.process(bot, member);
  } catch (e) {
    console.error(e.stack);
  }
  Options.findOne({
    ServerID: member.guild.id
  }, (err, opts) => {
    if (err) {
      console.log(err.stack)
    }
    if (opts) {
      let role = member.guild.roles.find(r => r.name === opts.AutoRole)

      if (!role) return;

      member.addRole(role)
    } else {
      return;
    }
  })
})

bot.on('guildCreate', (guild) => {
  try {
    eventlist.guildadd.process(bot, guild)
  } catch (e) {
    console.log(e.stack)
  }
})

bot.on('guildMemberRemove', (member) => {
  try {
    eventlist.leavee.process(bot, member)
    eventlist.kicke.process(bot, member)
  } catch (e) {
    console.error(e.stack);
  }
})

bot.login(process.env.TOKEN);