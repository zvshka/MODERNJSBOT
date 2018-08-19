//Вызов пакетов
const botconfig = require("./utils/botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const event = require('./commands/memberJoined')
const fetch = require('node-fetch')
const bannedwords = require('./utils/bannedwords.json')

let coins = require("./utils/coins.json");
let cooldown = new Set();
let cdseconds = 5;

//Считывание папки с командами
fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("не найдены команды.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} загружено!`);
    bot.commands.set(props.help.name, props);
  });

});
//Статус бота
bot.on("ready", () => {

  console.log(`Дата: ${Date()}; ${bot.user.username} онлайн на ${bot.guilds.size} серверах!`);
  bot.user.setActivity(`${Date()}`, {
    type: "WATCHING"
  });

});

bot.once("ready", () => {
  
  fetch(`${process.env.WARNS_URL}`)
    .then(res => res.json())
    .then(warns => fs.writeFile("./utils/warnings.json", JSON.stringify(warns), (err) => {
      if (err) console.log(err);
      console.log("Варны загружены")
  }));

  fetch(`${process.env.COINS_URL}`)
    .then(res => res.json())
    .then(coins => fs.writeFile("./utils/coins.json", JSON.stringify(coins), (err) => {
      if (err) console.log(err);
      console.log("Монеты ok")
  }));
  
  fetch(`${process.env.PREFIXES_URL}`)
    .then(res => res.json())
    .then(prefixes => fs.writeFile("./utils/prefixes.json", JSON.stringify(prefixes), (err) => {
      if (err) console.log(err);
      console.log("Префиксы ok")
  }));
  
  fetch(`${process.env.ROLES_URL}`)
    .then(res => res.json())
    .then(roles => fs.writeFile("./utils/autoroles.json", JSON.stringify(roles), (err) => {
      if (err) console.log(err);
      console.log("Варны загружены")
  }));

})


//Исполнение команд
bot.on("message", message => {
  //Проверка на то что создатель сообщения бот и канал DM
  if (message.author.bot) return
  if (message.channel.type === "dm") return;
  //Кастомный префикс
  let prefixes = JSON.parse(fs.readFileSync("./utils/prefixes.json", "utf8"));
  if (!prefixes[message.guild.id]) {
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }
  //Монетки :D
  if (!coins[message.author.id]) {
    coins[message.author.id] = {
      coins: 0
    };
  }

  let coinAmt = Math.floor(Math.random() * 15) + 1;
  let baseAmt = Math.floor(Math.random() * 15) + 1;

  console.log(`[log]${message.author.username}: ${message} ${coinAmt}/${baseAmt}`);


  if (coinAmt === baseAmt) {
    coins[message.author.id] = {
      coins: coins[message.author.id].coins + coinAmt
    };
    fs.writeFile("./utils/coins.json", JSON.stringify(coins), (err) => {
      if (err) console.log(err)
    });
    
    fetch(`${process.env.COINS_URL}`,  { 
      method: 'PUT',
      body:    JSON.stringify(coins),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => console.log(json))
    let coinEmbed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setColor("#3de2fa")
      .addField("💸", `${coinAmt} монет добавлено!`);

    message.channel.send(coinEmbed).then(msg => {
      msg.delete(5000)
    });
  }

  //Опять префикс
  let prefix = prefixes[message.guild.id].prefixes;
  if (!message.content.startsWith(prefix)) return;
  if (cooldown.has(message.author.id)) {
    message.delete();
    return message.reply("Подожди 5 секунд.")
  }
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    cooldown.add(message.author.id);
  }


  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(bot, message, args);

  setTimeout(() => {
    cooldown.delete(message.author.id)
  }, cdseconds * 1000)

  if (message.author.bot) return
  for (i in bannedwords.words) {
    if (message.content.toLowerCase().includes(bannedwords.words[i])) {
      message.delete();
      message.channel.send(`Мат запрещён`);
    }
  }

});
//Выдача роли когда кто-то вступает и приветствие
bot.on('guildMemberAdd', (member) => {
  let autorole = JSON.parse(fs.readFileSync('./utils/autoroles.json', 'utf8'))
  if (!autorole[member.guild.id]) autorole[member.guild.id] = {
    role: "off"
  }

  fs.writeFile('./utils/autoroles.json', JSON.stringify(autorole), (err) => {
    if (err) console.log(err)
  })

  let roles = autorole[member.guild.id].role

  let role = member.guild.roles.find(r => r.name === roles)

  if (!role) return;

  member.addRole(role)

  try {
    event.process(bot, member);
  } catch (e) {
    console.error(e.stack);
  }  

});

//Логин
bot.login(process.env.TOKEN)