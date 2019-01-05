const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const fs = require('fs')


module.exports.run = (bot, message, args) => {
  
}

module.exports.help = {
    name: "quest",
    usage: "quest [take/drop/add/list] [#квеста]",
    desc: "Квесты в результате которых ты получишь очки лояльности",
    group: "mod"
}
  