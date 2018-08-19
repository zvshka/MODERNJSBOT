const Discord = require("discord.js");
const fs = require("fs");
let coins = require("../utils/coins.json");

module.exports.run = (bot, message, args) => {
  //!pay @isatisfied 59345



  if(!coins[message.author.id]){
    return message.reply("Нет монет!")
  }

  let pUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);

  if(!pUser) return message.reply(`ничего не указанно`).then(msg => {msg.delete(5000)})
  
  if(!args[1]) return message.reply('Не указанно кол-во монет')

  if(!coins[pUser.id]){
    coins[pUser.id] = {
      coins: 0
    };
  }

  let pCoins = coins[pUser.id].coins;
  let sCoins = coins[message.author.id].coins;

  if(sCoins < args[0]) return message.reply("Не хватает монет!").then(msg => {msg.delete(5000)});

  coins[message.author.id] = {
    coins: sCoins - parseInt(args[1])
  };

  coins[pUser.id] = {
    coins: pCoins + parseInt(args[1])
  };

  message.channel.send(`${message.author} дал ${pUser} ${args[1]} монет.`).then(msg => {msg.delete(5000)});

  fs.writeFile("./utils/coins.json", JSON.stringify(coins), (err) => {
    if(err) cosole.log(err)
  });

  fetch(`${process.env.COINS_URL}`,  { 
    method: 'PUT',
    body:    JSON.stringify(coins),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res => res.json())
  .then(json => console.log(json))
}

module.exports.help = {
  name: "pay"
}
