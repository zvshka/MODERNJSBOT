const db = require('mongoose')

const coinSchema = db.Schema({

    UserID: String,
    ServerID: String,
    money: Number,

})

module.exports = db.model("coins", coinSchema)