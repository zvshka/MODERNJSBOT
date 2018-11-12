const Discord = require('discord.js');

const db = require('mongoose')
const Options = require('../models/servOpt.js')
db.connect("mongodb+srv://zvshka:1234@cil-mets2.mongodb.net/servers", {
    useNewUrlParser: true
})

module.exports = {
    process: (bot, guild) => {
        Options.findOne({
            ServerID: guild.id
        }, (err, opts) => {
            if(err) {
                console.log(err.stack)
            }
            if(!opts) {
                const newOpts = new Options({
                    ServerID: guild.id,
                    Prefix: "!",
                    AutoRole: "off"
                })
                newOpts.save().catch(err => console.log(err.stack))
            }
        })
    }
};